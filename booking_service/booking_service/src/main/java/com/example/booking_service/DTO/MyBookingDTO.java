package com.example.booking_service.DTO;

import com.example.booking_service.model.BookingEntity;
import com.example.booking_service.model.BookingStatus;
import com.example.booking_service.model.Passenger;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO returned by GET /booking/my containing the authenticated user's bookings,
 * including the passengers and the seats that were actually persisted.
 */
public class MyBookingDTO {

    private Long bookingId;
    private String pnr;
    private String bookingReference;
    private Long trainId;
    private Integer trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private BigDecimal fare;
    private BookingStatus bookingStatus;
    private String trainClass;
    private String quota;
    private LocalDateTime bookingTime;
    private List<PassengerDTO> passengers = new ArrayList<>();

    public static MyBookingDTO fromEntity(BookingEntity entity, List<Passenger> passengers) {
        MyBookingDTO dto = new MyBookingDTO();
        dto.bookingId = entity.getId();
        dto.pnr = entity.getPnr();
        dto.bookingReference = entity.getBookingReference();
        dto.trainId = entity.getTrainId();
        dto.trainNumber = entity.getTrainNumber();
        dto.trainName = entity.getTrainName();
        dto.source = entity.getSource();
        dto.destination = entity.getDestination();
        dto.journeyDate = entity.getJourneyDate();
        dto.fare = entity.getFare();
        dto.bookingStatus = entity.getBookingStatus();
        dto.trainClass = entity.getTrainClass() != null ? entity.getTrainClass().name() : null;
        dto.quota = entity.getQuota() != null ? entity.getQuota().name() : null;
        dto.bookingTime = entity.getBookingTime();
        if (passengers != null) {
            for (Passenger p : passengers) {
                PassengerDTO pd = new PassengerDTO(p.getPassengerName(), p.getAge(), p.getGender());
                pd.setSeatNumber(p.getSeatNumber());
                dto.passengers.add(pd);
            }
        }
        return dto;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public String getPnr() { return pnr; }
    public void setPnr(String pnr) { this.pnr = pnr; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
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
    public BigDecimal getFare() { return fare; }
    public void setFare(BigDecimal fare) { this.fare = fare; }
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    public String getTrainClass() { return trainClass; }
    public void setTrainClass(String trainClass) { this.trainClass = trainClass; }
    public String getQuota() { return quota; }
    public void setQuota(String quota) { this.quota = quota; }
    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
    public List<PassengerDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDTO> passengers) { this.passengers = passengers; }
}
