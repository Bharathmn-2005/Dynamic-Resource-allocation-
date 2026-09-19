package com.example.booking_service.DTO;

import com.example.booking_service.model.TrainStatus;
import com.example.booking_service.model.TrainType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TrainResponseDTO {

    private Long id;
    private Integer trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer durationInMinutes;
    private Double distanceKm;
    private Integer availableSeats;
    private Integer totalSeats;
    private Integer racCount = 0;
    private Integer waitlistCount = 0;
    private BigDecimal fare;
    @Enumerated(EnumType.STRING)
    private TrainType trainType;

    @Enumerated(EnumType.STRING)
    private TrainStatus trainStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(Integer trainNumber) {
        this.trainNumber = trainNumber;
    }

    public String getTrainName() {
        return trainName;
    }

    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(Integer durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getRacCount() {
        return racCount;
    }

    public void setRacCount(Integer racCount) {
        this.racCount = racCount;
    }

    public Integer getWaitlistCount() {
        return waitlistCount;
    }

    public void setWaitlistCount(Integer waitlistCount) {
        this.waitlistCount = waitlistCount;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public TrainType getTrainType() {
        return trainType;
    }

    public void setTrainType(TrainType trainType) {
        this.trainType = trainType;
    }

    public TrainStatus getTrainStatus() {
        return trainStatus;
    }

    public void setTrainStatus(TrainStatus trainStatus) {
        this.trainStatus = trainStatus;
    }

    public TrainResponseDTO() {

    }

    public TrainResponseDTO(Long id, Integer trainNumber, String trainName, String source, String destination, LocalDateTime departureTime, LocalDateTime arrivalTime, Integer durationInMinutes, Double distanceKm, Integer availableSeats, BigDecimal fare) {
        this.id = id;
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.durationInMinutes = durationInMinutes;
        this.distanceKm = distanceKm;
        this.availableSeats = availableSeats;
        this.fare = fare;
    }
}
