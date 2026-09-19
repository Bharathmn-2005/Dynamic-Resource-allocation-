package com.example.booking_service.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;

@Document(indexName = "trains")
public class TrainSearchDocument {
    public static final String INDEX_NAME = "trains";

    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String pnrNumber;

    @Field(type = FieldType.Integer)
    private Integer trainNumber;

    @Field(type = FieldType.Date)
    private LocalDate journeyDate;

    @Field(type = FieldType.Keyword)
    private String classOfTravel;

    @Field(type = FieldType.Keyword)
    private String quota;

    @Field(type = FieldType.Keyword)
    private String sourceStation;

    @Field(type = FieldType.Keyword)
    private String sourceStationNormalized;

    @Field(type = FieldType.Keyword)
    private String destinationStation;

    @Field(type = FieldType.Keyword)
    private String destinationStationNormalized;

    @Field(type = FieldType.Date)
    private LocalDate bookingDate;

    @Field(type = FieldType.Keyword)
    private String currentStatus;

    @Field(type = FieldType.Integer)
    private Integer numberOfPassengers;

    @Field(type = FieldType.Keyword)
    private String ageOfPassengers;

    @Field(type = FieldType.Keyword)
    private String bookingChannel;

    @Field(type = FieldType.Double)
    private Double travelDistance;

    @Field(type = FieldType.Integer)
    private Integer numberOfStations;

    @Field(type = FieldType.Double)
    private Double travelTime;

    @Field(type = FieldType.Keyword)
    private String trainType;

    @Field(type = FieldType.Integer)
    private Integer seatAvailability;

    @Field(type = FieldType.Keyword)
    private String specialConsiderations;

    @Field(type = FieldType.Keyword)
    private String holidayOrPeakSeason;

    @Field(type = FieldType.Keyword)
    private String waitlistPosition;

    @Field(type = FieldType.Keyword)
    private String confirmationStatus;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPnrNumber() {
        return pnrNumber;
    }

    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }

    public Integer getTrainNumber() {
        return trainNumber;
    }

    public void setTrainNumber(Integer trainNumber) {
        this.trainNumber = trainNumber;
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

    public String getSourceStation() {
        return sourceStation;
    }

    public void setSourceStation(String sourceStation) {
        this.sourceStation = sourceStation;
    }

    public String getSourceStationNormalized() {
        return sourceStationNormalized;
    }

    public void setSourceStationNormalized(String sourceStationNormalized) {
        this.sourceStationNormalized = sourceStationNormalized;
    }

    public String getDestinationStation() {
        return destinationStation;
    }

    public void setDestinationStation(String destinationStation) {
        this.destinationStation = destinationStation;
    }

    public String getDestinationStationNormalized() {
        return destinationStationNormalized;
    }

    public void setDestinationStationNormalized(String destinationStationNormalized) {
        this.destinationStationNormalized = destinationStationNormalized;
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
}
