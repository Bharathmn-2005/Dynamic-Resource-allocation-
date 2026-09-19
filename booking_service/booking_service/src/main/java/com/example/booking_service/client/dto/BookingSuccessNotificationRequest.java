package com.example.booking_service.client.dto;

public record BookingSuccessNotificationRequest(
        Long bookingId,
        Long userId,
        String email,
        String movieName,
        String theatreName,
        String showTime,
        String seatNumbers,
        Double bookingAmount) {
}
