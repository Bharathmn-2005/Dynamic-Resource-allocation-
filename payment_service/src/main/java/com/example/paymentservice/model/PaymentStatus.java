package com.example.paymentservice.model;

/**
 * Lifecycle states for a payment.
 */
public enum PaymentStatus {
    CREATED,
    PROCESSING,
    SUCCESS,
    FAILED,
    CANCELLED,
    REFUNDED
}