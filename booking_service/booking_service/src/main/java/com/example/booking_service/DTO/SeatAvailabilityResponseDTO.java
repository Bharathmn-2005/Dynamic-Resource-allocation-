package com.example.booking_service.DTO;

public class SeatAvailabilityResponseDTO {
    private Integer trainNumber;
    private String trainName;
    private Integer totalSeats;
    private Integer availableSeats;

    public SeatAvailabilityResponseDTO()
    {

    }
    public SeatAvailabilityResponseDTO(Integer trainNumber, String trainName, Integer totalSeats, Integer availableSeats) {
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
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

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
}
