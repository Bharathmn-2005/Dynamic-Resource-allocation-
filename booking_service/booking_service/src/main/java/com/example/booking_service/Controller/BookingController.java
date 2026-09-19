package com.example.booking_service.Controller;

import com.example.booking_service.DTO.BookingDetailsDTO;
import com.example.booking_service.DTO.BookingRequestDTO;
import com.example.booking_service.DTO.BookingResponseDTO;
import com.example.booking_service.DTO.MyBookingDTO;
import com.example.booking_service.Service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> bookTicket(
            Authentication authentication,
            @Valid @RequestBody BookingRequestDTO request) {

        BookingResponseDTO response = bookingService.bookTicket(authentication, request);

        return ResponseEntity.ok(response);
    }

        @GetMapping("/my")
    public ResponseEntity<List<MyBookingDTO>> getMyBookings(
            Authentication authentication) {

        List<MyBookingDTO> response =
                bookingService.getUserBookings(authentication);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDetailsDTO> getBooking(
            @PathVariable Long bookingId,
            Authentication authentication) {

        BookingDetailsDTO response =
                BookingDetailsDTO.fromEntity(bookingService.getOwnedBooking(bookingId, authentication));

        return ResponseEntity.ok(response);
    }
}