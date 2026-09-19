package com.example.booking_service.DTO;

import com.example.booking_service.model.BookingEntity;
import com.example.booking_service.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Lightweight booking response used when validating a booking during
 * payment initiation (consumed by the Payment Service).
 */
public class BookingDetailsDTO {

    private Long bookingId;
    private String pnr;
    private String bookingReference;
    private String userEmail;
    private Long userId;
    private Long trainId;
    private Integer trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private String seatNumber;
    private BigDecimal fare;
    private BookingStatus bookingStatus;

    public static BookingDetailsDTO fromEntity(BookingEntity entity) {
        BookingDetailsDTO dto = new BookingDetailsDTO();
        dto.bookingId = entity.getId();
        dto.pnr = entity.getPnr();
        dto.bookingReference = entity.getBookingReference();
        dto.userEmail = entity.getUserEmail();
        dto.userId = entity.getUserId();
        dto.trainId = entity.getTrainId();
        dto.trainNumber = entity.getTrainNumber();
        dto.trainName = entity.getTrainName();
        dto.source = entity.getSource();
        dto.destination = entity.getDestination();
        dto.journeyDate = entity.getJourneyDate();
        dto.seatNumber = entity.getSeatNumber();
        dto.fare = entity.getFare();
        dto.bookingStatus = entity.getBookingStatus();
        return dto;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getTrainId() { return trainId; }
    public void setTrainId(Long trainId) { this.trainId = trainId; }
    public Integer getTrainNumber() { return trainNumber; }
    public void setTrainNumber(Integer trainNumber) { this.trainNumber = trainNumber; }
    public String getTrainName() { return trainName; }
    public void setTrainName(String trainName) { this.trainName = trainName; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalDate getJourneyDate() { return journeyDate; }
    public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public BigDecimal getFare() { return fare; }
    public void setFare(BigDecimal fare) { this.fare = fare; }
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
}