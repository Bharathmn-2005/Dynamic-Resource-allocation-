package com.example.booking_service.DTO;

import com.example.booking_service.model.BookingStatus;

public class BookingResponseDTO {
    private Long bookingId;
    private String bookingReference;

    private String passengerName;

    private String seatNumber;

    private BookingStatus bookingStatus;

    private String message;

    public BookingResponseDTO()
    {

    }
        public BookingResponseDTO(Long bookingId, String bookingReference, String passengerName, String seatNumber, BookingStatus bookingStatus, String message) {
        this.bookingId = bookingId;
        this.bookingReference = bookingReference;
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
        this.bookingStatus = bookingStatus;
        this.message = message;
    }

        public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
