package com.example.paymentservice.Repository;

import com.example.paymentservice.model.PaymentEntity;
import com.example.paymentservice.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    Optional<PaymentEntity> findByPaymentId(String paymentId);

    Optional<PaymentEntity> findByOrderId(String orderId);

    List<PaymentEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<PaymentEntity> findByBookingId(Long bookingId);

    boolean existsByBookingIdAndStatus(Long bookingId, PaymentStatus status);
}