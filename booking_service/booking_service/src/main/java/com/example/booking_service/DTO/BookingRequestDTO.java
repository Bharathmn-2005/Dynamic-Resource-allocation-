package com.example.booking_service.DTO;

import com.example.booking_service.model.BerthPreference;
import com.example.booking_service.model.Gender;

import java.time.LocalDate;
import java.util.List;

public class BookingRequestDTO {
    private Long trainId;

    private LocalDate travelDate;

    private String passengerName;

    private Integer age;

    private Gender gender;

    private BerthPreference berthPreference = BerthPreference.LOWER;

    private List<PassengerDTO> passengers;

    private List<String> seatNumbers;

    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long trainId, LocalDate travelDate, String passengerName, Integer age, Gender gender, BerthPreference berthPreference) {
        this.trainId = trainId;
        this.travelDate = travelDate;
        this.passengerName = passengerName;
        this.age = age;
        this.gender = gender;
        this.berthPreference = berthPreference == null ? BerthPreference.LOWER : berthPreference;
    }

    public Long getTrainId() {
        return trainId;
    }

    public void setTrainId(Long trainId) {
        this.trainId = trainId;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public BerthPreference getBerthPreference() {
        return berthPreference == null ? BerthPreference.LOWER : berthPreference;
    }

    public void setBerthPreference(BerthPreference berthPreference) {
        this.berthPreference = berthPreference == null ? BerthPreference.LOWER : berthPreference;
    }

    public List<PassengerDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDTO> passengers) {
        this.passengers = passengers;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
