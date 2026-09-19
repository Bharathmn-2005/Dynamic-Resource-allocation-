package com.example.booking_service.Mapper;

import com.example.booking_service.DTO.TrainResponseDTO;
import com.example.booking_service.model.TrainDetails;

public class TrainMapper {

    public static TrainResponseDTO toDTO(TrainDetails train){

        TrainResponseDTO dto = new TrainResponseDTO();

        dto.setId(train.getId());
        dto.setTrainNumber(train.getTrainNumber());
        dto.setTrainName(train.getTrainName());
        dto.setSource(train.getSource());
        dto.setDestination(train.getDestination());
        dto.setDepartureTime(train.getDepartureTime());
        dto.setArrivalTime(train.getArrivalTime());
        dto.setDurationInMinutes(train.getDurationInMinutes());
        dto.setDistanceKm(train.getDistanceKm());
        dto.setAvailableSeats(train.getAvailableSeats());
        dto.setFare(train.getFare());
        dto.setTrainType(train.getTrainType());

        return dto;
    }
}
