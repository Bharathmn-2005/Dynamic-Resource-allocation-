package com.example.booking_service.DTO;

import java.time.LocalDate;

public class TrainSearchResultDTO {
    private String recordId;
    private Integer trainNumber;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private String classOfTravel;
    private String quota;
    private LocalDate bookingDate;
    private String currentStatus;
    private Integer numberOfPassengers;
    private String ageOfPassengers;
    private String bookingChannel;
    private Double travelDistance;
    private Integer numberOfStations;
    private Double travelTime;
    private String trainType;
    private Integer seatAvailability;
    private String specialConsiderations;
    private String holidayOrPeakSeason;
    private String waitlistPosition;
    private String confirmationStatus;
    private Long bookableTrainId;
    private boolean bookable;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public Integer getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(Integer trainNumber) {
        this.trainNumber = trainNumber;
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

    public LocalDate getJourneyDate() {
        return journeyDate;
    }

    public void setJourneyDate(LocalDate journeyDate) {
        this.journeyDate = journeyDate;
    }

    public String getClassOfTravel() {
        return classOfTravel;
    }

    public void setClassOfTravel(String classOfTravel) {
        this.classOfTravel = classOfTravel;
    }

    public String getQuota() {
        return quota;
    }

    public void setQuota(String quota) {
        this.quota = quota;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(String currentStatus) {
        this.currentStatus = currentStatus;
    }

    public Integer getNumberOfPassengers() {
        return numberOfPassengers;
    }

    public void setNumberOfPassengers(Integer numberOfPassengers) {
        this.numberOfPassengers = numberOfPassengers;
    }

    public String getAgeOfPassengers() {
        return ageOfPassengers;
    }

    public void setAgeOfPassengers(String ageOfPassengers) {
        this.ageOfPassengers = ageOfPassengers;
    }

    public String getBookingChannel() {
        return bookingChannel;
    }

    public void setBookingChannel(String bookingChannel) {
        this.bookingChannel = bookingChannel;
    }

    public Double getTravelDistance() {
        return travelDistance;
    }

    public void setTravelDistance(Double travelDistance) {
        this.travelDistance = travelDistance;
    }

    public Integer getNumberOfStations() {
        return numberOfStations;
    }

    public void setNumberOfStations(Integer numberOfStations) {
        this.numberOfStations = numberOfStations;
    }

    public Double getTravelTime() {
        return travelTime;
    }

    public void setTravelTime(Double travelTime) {
        this.travelTime = travelTime;
    }

    public String getTrainType() {
        return trainType;
    }

    public void setTrainType(String trainType) {
        this.trainType = trainType;
    }

    public Integer getSeatAvailability() {
        return seatAvailability;
    }

    public void setSeatAvailability(Integer seatAvailability) {
        this.seatAvailability = seatAvailability;
    }

    public String getSpecialConsiderations() {
        return specialConsiderations;
    }

    public void setSpecialConsiderations(String specialConsiderations) {
        this.specialConsiderations = specialConsiderations;
    }

    public String getHolidayOrPeakSeason() {
        return holidayOrPeakSeason;
    }

    public void setHolidayOrPeakSeason(String holidayOrPeakSeason) {
        this.holidayOrPeakSeason = holidayOrPeakSeason;
    }

    public String getWaitlistPosition() {
        return waitlistPosition;
    }

    public void setWaitlistPosition(String waitlistPosition) {
        this.waitlistPosition = waitlistPosition;
    }

    public String getConfirmationStatus() {
        return confirmationStatus;
    }

    public void setConfirmationStatus(String confirmationStatus) {
        this.confirmationStatus = confirmationStatus;
    }

    public Long getBookableTrainId() {
        return bookableTrainId;
    }

    public void setBookableTrainId(Long bookableTrainId) {
        this.bookableTrainId = bookableTrainId;
    }

    public boolean isBookable() {
        return bookable;
    }

    public void setBookable(boolean bookable) {
        this.bookable = bookable;
    }
}
