package com.example.booking_service.exception;

public class InvalidPassengerException extends RuntimeException {
    public InvalidPassengerException(String message) {
        super(message);
    }

    public InvalidPassengerException(String message, Throwable cause) {
        super(message, cause);
    }
}
