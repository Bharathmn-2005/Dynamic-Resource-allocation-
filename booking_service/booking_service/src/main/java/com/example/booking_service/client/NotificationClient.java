package com.example.booking_service.client;

import com.example.booking_service.client.dto.BookingFailureNotificationRequest;
import com.example.booking_service.client.dto.BookingSuccessNotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.ResourceAccessException;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestClient restClient;

    public NotificationClient(@Value("${notification.service.url}") String notificationServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(notificationServiceUrl)
                .build();
    }

    public void sendBookingSuccess(BookingSuccessNotificationRequest request) {
        try {
            log.info("Sending booking success notification request: {}", request);
            String response = restClient.post()
                    .uri("/api/v1/notifications/booking-success")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(String.class);
            log.info("Booking success notification response: {}", response);
        } catch (RestClientException ex) {
            log.error("Booking success notification failed: {}", ex.getMessage(), ex);
        }
    }

    public void sendBookingFailure(BookingFailureNotificationRequest request) {
        try {
            log.info("Sending booking failure notification request: {}", request);
            String response = restClient.post()
                    .uri("/api/v1/notifications/booking-failure")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(String.class);
            log.info("Booking failure notification response: {}", response);
        } catch (RestClientException ex) {
            log.error("Booking failure notification failed: {}", ex.getMessage(), ex);
        }
    }
}
