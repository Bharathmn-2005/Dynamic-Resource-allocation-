package com.example.paymentservice.exception;

public class UnauthorizedPaymentException extends RuntimeException {
    public UnauthorizedPaymentException(String message) {
        super(message);
    }
}