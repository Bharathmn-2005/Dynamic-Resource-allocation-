package com.example.paymentservice.dto;

import com.example.paymentservice.model.PaymentEntity;
import com.example.paymentservice.model.PaymentProvider;
import com.example.paymentservice.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * API response representing a payment. Never exposes internal provider
 * credentials or sensitive payment details.
 */
public class PaymentResponse {

    private String paymentId;
    private String orderId;
    private Long bookingId;
    private Long userId;
    private BigDecimal amount;
    private String currency;
    private PaymentProvider provider;
    private String providerReferenceId;
    private PaymentStatus status;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;

    public static PaymentResponse fromEntity(PaymentEntity entity) {
        PaymentResponse response = new PaymentResponse();
        response.paymentId = entity.getPaymentId();
        response.orderId = entity.getOrderId();
        response.bookingId = entity.getBookingId();
        response.userId = entity.getUserId();
        response.amount = entity.getAmount();
        response.currency = entity.getCurrency();
        response.provider = entity.getProvider();
        response.providerReferenceId = entity.getProviderReferenceId();
        response.status = entity.getStatus();
        response.failureReason = entity.getFailureReason();
        response.createdAt = entity.getCreatedAt();
        response.paidAt = entity.getPaidAt();
        return response;
    }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public PaymentProvider getProvider() { return provider; }
    public void setProvider(PaymentProvider provider) { this.provider = provider; }
    public String getProviderReferenceId() { return providerReferenceId; }
    public void setProviderReferenceId(String providerReferenceId) { this.providerReferenceId = providerReferenceId; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}