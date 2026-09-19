package com.example.paymentservice.Controller;

import com.example.paymentservice.Service.PaymentService;
import com.example.paymentservice.dto.PaymentResponse;
import com.example.paymentservice.exception.InvalidWebhookException;
import com.example.paymentservice.gateway.PaymentGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Receives asynchronous webhook callbacks from the configured payment
 * provider. The gateway signature is verified before any state change is
 * applied, and processing is idempotent to tolerate duplicate delivery/retries.
 */
@RestController
@RequestMapping("/api/payments/webhook")
public class PaymentWebhookController {

    private static final Logger log = LoggerFactory.getLogger(PaymentWebhookController.class);
    private static final String RAZORPAY_SIGNATURE_HEADER = "X-Razorpay-Signature";
    private static final String EVENT_CAPTURED = "payment.captured";
    private static final String EVENT_FAILED = "payment.failed";

    private final PaymentService paymentService;
    private final PaymentGateway paymentGateway;

    public PaymentWebhookController(PaymentService paymentService, PaymentGateway paymentGateway) {
        this.paymentService = paymentService;
        this.paymentGateway = paymentGateway;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> handle(
            @RequestBody String rawBody,
            @RequestHeader(value = RAZORPAY_SIGNATURE_HEADER, required = false) String signature) {

        if (!paymentGateway.verifyWebhook(signature, rawBody)) {
            log.warn("Rejected webhook with invalid or missing signature");
            throw new InvalidWebhookException("Webhook signature verification failed");
        }

        String event = extractStringField(rawBody, "event");
        String orderId = resolveOrderId(rawBody);

        if (orderId == null || orderId.isBlank()) {
            throw new InvalidWebhookException("Webhook payload did not contain a valid order id");
        }
        if (event == null || event.isBlank()) {
            throw new InvalidWebhookException("Webhook payload did not contain an event type");
        }

        if (EVENT_CAPTURED.equals(event)) {
            PaymentResponse result = paymentService.applyProviderSuccess(orderId);
            log.info("Processed webhook event {} for order {} -> {}", event, orderId, result.getStatus());
            return ResponseEntity.ok(Map.of("status", result.getStatus().name()));
        }

        if (EVENT_FAILED.equals(event)) {
            String reason = extractNestedFailureReason(rawBody);
            PaymentResponse result = paymentService.applyProviderFailure(orderId, reason);
            log.info("Processed webhook event {} for order {} -> {}", event, orderId, result.getStatus());
            return ResponseEntity.ok(Map.of("status", result.getStatus().name()));
        }

        // Acknowledge non-terminal/unrecognized events without changing state.
        log.info("Ignoring webhook event: {}", event);
        return ResponseEntity.ok(Map.of("status", "ACK"));
    }

    /**
     * Extracts a top-level JSON string field value (e.g. "event":"payment.captured").
     */
    private String extractStringField(String json, String field) {
        String marker = "\"" + field + "\":\"";
        int idx = json == null ? -1 : json.indexOf(marker);
        if (idx < 0) {
            return null;
        }
        int start = idx + marker.length();
        int end = json.indexOf('"', start);
        return end < 0 ? null : json.substring(start, end);
    }

    /**
     * Resolves the provider order id. Handles the Razorpay-style nested path
     * (payload.payment.entity.order_id) and falls back to a top-level order_id.
     */
    private String resolveOrderId(String json) {
        // The entity object containing the order_id appears after "entity".
        String entityMarker = "\"entity\":{";
        int entityIdx = json == null ? -1 : json.indexOf(entityMarker);
        if (entityIdx >= 0) {
            String nested = extractStringField(json.substring(entityIdx), "order_id");
            if (nested != null && !nested.isBlank()) {
                return nested;
            }
        }
        return extractStringField(json, "order_id");
    }

    private String extractNestedFailureReason(String json) {
        // Razorpay places the failure reason at payload.failure.reason.
        String marker = "\"reason\":\"";
        int idx = json == null ? -1 : json.indexOf(marker);
        if (idx < 0) {
            return "Payment failed at provider";
        }
        int start = idx + marker.length();
        int end = json.indexOf('"', start);
        return end < 0 ? "Payment failed at provider" : json.substring(start, end);
    }
}