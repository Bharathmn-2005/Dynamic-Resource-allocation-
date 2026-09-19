package com.example.booking_service.DTO;

import com.example.booking_service.model.BookingQuota;
import com.example.booking_service.model.TrainClass;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public class TrainSearchAndBookingRequestDTO {
    
    @NotBlank(message = "Source station is required")
    private String source;

    @NotBlank(message = "Destination station is required")
    private String destination;

    @FutureOrPresent(message = "Journey date must be today or in the future")
    private LocalDate journeyDate;

    @NotNull(message = "Train class is required")
    private TrainClass trainClass;

    @NotNull(message = "Quota is required")
    private BookingQuota quota;

    @Min(value = 1, message = "Passenger count must be at least 1")
    @Max(value = 8, message = "Maximum 8 passengers per booking")
    private Integer passengerCount;

    @Valid
    @NotEmpty(message = "At least one passenger is required")
    private List<PassengerDTO> passengers;

    // For search requests, only source, destination, journeyDate, trainClass, quota, passengerCount are needed
    // For booking requests, trainId and passengers are also needed
    
    private Long trainId;

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getJourneyDate() { return journeyDate; }
    public void setJourneyDate(LocalDate journeyDate) { this.journeyDate = journeyDate; }

    public TrainClass getTrainClass() { return trainClass; }
    public void setTrainClass(TrainClass trainClass) { this.trainClass = trainClass; }

    public BookingQuota getQuota() { return quota; }
    public void setQuota(BookingQuota quota) { this.quota = quota; }

    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer passengerCount) { this.passengerCount = passengerCount; }

    public List<PassengerDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDTO> passengers) { this.passengers = passengers; }

    public Long getTrainId() { return trainId; }
    public void setTrainId(Long trainId) { this.trainId = trainId; }
}
