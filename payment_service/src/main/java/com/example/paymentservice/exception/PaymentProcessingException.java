package com.example.paymentservice.exception;

/**
 * Thrown when a payment cannot be processed because the booking could not be
 * validated by the booking service (e.g. booking service unavailable).
 */
public class PaymentProcessingException extends RuntimeException {
    public PaymentProcessingException(String message) {
        super(message);
    }

    public PaymentProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}