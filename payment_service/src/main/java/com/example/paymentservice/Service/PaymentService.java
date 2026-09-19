package com.example.paymentservice.Service;

import com.example.paymentservice.Repository.PaymentRepository;
import com.example.paymentservice.client.BookingClient;
import com.example.paymentservice.client.dto.BookingDetails;
import com.example.paymentservice.dto.PaymentInitiateRequest;
import com.example.paymentservice.dto.PaymentResponse;
import com.example.paymentservice.exception.InvalidPaymentStateException;
import com.example.paymentservice.exception.PaymentNotFoundException;
import com.example.paymentservice.exception.UnauthorizedPaymentException;
import com.example.paymentservice.gateway.PaymentGateway;
import com.example.paymentservice.model.PaymentEntity;
import com.example.paymentservice.model.PaymentStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final PaymentGateway paymentGateway;
    private final String currency;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingClient bookingClient,
                          PaymentGateway paymentGateway,
                          @Value("${payment.currency:INR}") String currency) {
        this.paymentRepository = paymentRepository;
        this.bookingClient = bookingClient;
        this.paymentGateway = paymentGateway;
        this.currency = currency == null ? "INR" : currency;
    }

    /**
     * Initiates a payment for an existing booking. The booking is validated
     * (including ownership) against the booking service, and the fare is
     * taken from the booking rather than trusted from the client.
     */
    @Transactional
    public PaymentResponse initiate(Authentication authentication, String bearerToken, PaymentInitiateRequest request) {
        BookingDetails booking = bookingClient.fetchBooking(request.getBookingId(), bearerToken);
        Long userId = resolveUserId(authentication);

        if (booking.getBookingId() == null) {
            throw new PaymentNotFoundException("Booking not found with id: " + request.getBookingId());
        }

        // Prevent duplicate active/completed payments for the same booking.
        if (paymentRepository.existsByBookingIdAndStatus(booking.getBookingId(), PaymentStatus.SUCCESS)) {
            throw new InvalidPaymentStateException("A successful payment already exists for this booking");
        }

        String paymentId = generateReference("PAY");
        String orderId = generateReference("ORDER");

        PaymentGateway.ProviderOrder providerOrder = paymentGateway.createOrder(
                paymentId, booking.getFare(), currency);

        PaymentEntity entity = new PaymentEntity();
        entity.setPaymentId(paymentId);
        entity.setOrderId(orderId);
        entity.setBookingId(booking.getBookingId());
        entity.setUserId(userId);
        entity.setUserEmail(authentication.getName());
        entity.setAmount(booking.getFare());
        entity.setCurrency(currency);
        entity.setProvider(paymentGateway.provider());
        entity.setProviderReferenceId(providerOrder.getProviderOrderId());
        entity.setStatus(PaymentStatus.PROCESSING);

        PaymentEntity saved = paymentRepository.save(entity);
        return PaymentResponse.fromEntity(saved);
    }
    // __MORE__
    /**
     * Confirms a payment as successful. In the sandbox flow this mimics the
     * payment provider completing the transaction; for a real provider the
     * authoritative status change arrives via a verified webhook.
     */
    @Transactional
    public PaymentResponse confirmPayment(Authentication auth, String paymentId) {
        PaymentEntity entity = getOwnedEntity(auth, paymentId);
        if (entity.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentResponse.fromEntity(entity);
        }
        if (entity.getStatus() == PaymentStatus.CANCELLED || entity.getStatus() == PaymentStatus.FAILED
                || entity.getStatus() == PaymentStatus.REFUNDED) {
            throw new InvalidPaymentStateException(
                    "Payment is in a terminal state (" + entity.getStatus() + ") and cannot be confirmed");
        }
        applySuccess(entity);
        return PaymentResponse.fromEntity(entity);
    }
    // __MORE__
    /**
     * Marks a payment as failed. Used by the sandbox flow and available to a
     * real provider through a verified webhook.
     */
    @Transactional
    public PaymentResponse failPayment(Authentication auth, String paymentId, String reason) {
        PaymentEntity entity = getOwnedEntity(auth, paymentId);
        if (entity.getStatus() == PaymentStatus.SUCCESS) {
            throw new InvalidPaymentStateException("A successful payment cannot be marked as failed");
        }
        entity.setStatus(PaymentStatus.FAILED);
        entity.setFailureReason(sanitize(reason));
        return PaymentResponse.fromEntity(paymentRepository.save(entity));
    }

    /**
     * Cancels a payment that has not yet completed.
     */
    @Transactional
    public PaymentResponse cancelPayment(Authentication auth, String paymentId) {
        PaymentEntity entity = getOwnedEntity(auth, paymentId);
        if (entity.getStatus() == PaymentStatus.SUCCESS) {
            throw new InvalidPaymentStateException("A successful payment cannot be cancelled");
        }
        if (entity.getStatus() == PaymentStatus.CANCELLED) {
            return PaymentResponse.fromEntity(entity);
        }
        entity.setStatus(PaymentStatus.CANCELLED);
        return PaymentResponse.fromEntity(paymentRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Authentication auth, String paymentId) {
        PaymentEntity entity = getOwnedEntity(auth, paymentId);
        return PaymentResponse.fromEntity(entity);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getUserPayments(Authentication auth) {
        Long userId = resolveUserId(auth);
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }
    /**
     * Applies a provider-triggered success. Idempotent so a duplicated webhook
     * or confirm call does not double-process.
     */
    @Transactional
    public PaymentResponse applyProviderSuccess(String orderId) {
        PaymentEntity entity = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for order: " + orderId));
        if (entity.getStatus() == PaymentStatus.SUCCESS) {
            return PaymentResponse.fromEntity(entity);
        }
        applySuccess(entity);
        return PaymentResponse.fromEntity(entity);
    }

    /**
     * Applies a provider-triggered failure, ignoring duplicate terminal updates.
     */
    @Transactional
    public PaymentResponse applyProviderFailure(String orderId, String reason) {
        PaymentEntity entity = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found for order: " + orderId));
        if (entity.getStatus() == PaymentStatus.SUCCESS) {
            throw new InvalidPaymentStateException("Payment is already successful and cannot be failed");
        }
        entity.setStatus(PaymentStatus.FAILED);
        entity.setFailureReason(sanitize(reason));
        return PaymentResponse.fromEntity(paymentRepository.save(entity));
    }

    private void applySuccess(PaymentEntity entity) {
        entity.setStatus(PaymentStatus.SUCCESS);
        entity.setPaidAt(java.time.LocalDateTime.now());
        entity.setFailureReason(null);
        paymentRepository.save(entity);
    }

    private PaymentEntity getOwnedEntity(Authentication auth, String paymentId) {
        PaymentEntity entity = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with id: " + paymentId));

        boolean isOwner = entity.getUserEmail().equalsIgnoreCase(auth.getName())
                || entity.getUserId().equals(resolveUserId(auth));

        if (!isOwner) {
            throw new UnauthorizedPaymentException("You do not have access to this payment");
        }
        return entity;
    }

    private Long resolveUserId(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof com.example.paymentservice.security.PaymentPrincipal principal) {
            return principal.getId();
        }
        return 0L;
    }

    private String generateReference(String prefix) {
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        return prefix + uuid;
    }

    /**
     * Strips newlines/control characters before persisting failure messages so
     * they cannot be used to inject log content. Sensitive provider details are
     * never stored.
     */
    private String sanitize(String value) {
        if (value == null) {
            return null;
        }
        return value.replaceAll("[\\r\\n\\t]+", " ").trim();
    }
}