package com.example.booking_service.DTO;

import java.time.LocalDate;

public class TrainRequestDTO {
    private String source;
    private String destination;
    private LocalDate travleDate;
    public TrainRequestDTO()
    {

    }
    public TrainRequestDTO(String source, String destination, LocalDate travleDate) {
        this.source = source;
        this.destination = destination;
        this.travleDate = travleDate;
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

    public LocalDate getTravleDate() {
        return travleDate;
    }

    public void setTravleDate(LocalDate travleDate) {
        this.travleDate = travleDate;
    }
}
