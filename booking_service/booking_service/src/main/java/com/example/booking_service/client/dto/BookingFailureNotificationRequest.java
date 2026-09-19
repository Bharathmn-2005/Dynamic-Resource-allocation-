package com.example.booking_service.client.dto;

public record BookingFailureNotificationRequest(
        Long bookingId,
        Long userId,
        String email,
        String movieName,
        String failureReason) {
}
