package com.example.paymentservice.client;

import com.example.paymentservice.client.dto.BookingDetails;
import com.example.paymentservice.exception.PaymentProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Client for validating a booking with the Booking Service before a payment is
 * created. Forwards the caller's JWT so the booking service can enforce
 * ownership.
 */
@Component
public class BookingClient {

    private static final Logger log = LoggerFactory.getLogger(BookingClient.class);

    private final RestClient restClient;

    public BookingClient(@Value("${booking.service.url}") String bookingServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(bookingServiceUrl)
                .build();
    }

    public BookingDetails fetchBooking(Long bookingId, String bearerToken) {
        try {
            log.info("Validating booking {} against booking service", bookingId);
            return restClient.get()
                    .uri("/booking/{bookingId}", bookingId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + bearerToken)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .retrieve()
                    .body(BookingDetails.class);
        } catch (RestClientException ex) {
            log.error("Failed to validate booking {} against booking service: {}", bookingId, ex.getMessage());
            throw new PaymentProcessingException(
                    "Unable to validate the booking with the booking service. Please try again later.", ex);
        }
    }
}