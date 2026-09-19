package com.example.booking_service.exception;

public class UnauthorizedBookingException extends RuntimeException {
    public UnauthorizedBookingException(String message) {
        super(message);
    }

    public UnauthorizedBookingException(String message, Throwable cause) {
        super(message, cause);
    }
}
