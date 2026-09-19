package com.example.paymentservice.exception;

/**
 * Thrown when a webhook signature/verification fails or the webhook payload is
 * invalid. Kept distinct so callers can treat validation failures as expected.
 */
public class InvalidWebhookException extends RuntimeException {
    public InvalidWebhookException(String message) {
        super(message);
    }
}