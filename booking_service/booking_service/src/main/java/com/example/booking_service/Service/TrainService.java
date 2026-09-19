package com.example.booking_service.Service;

import com.example.booking_service.DTO.SeatAvailabilityResponseDTO;
import com.example.booking_service.DTO.TrainResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {
    private final RailwayDatasetCatalog catalog;

    public TrainService(RailwayDatasetCatalog catalog) {
        this.catalog = catalog;
    }
    public List<TrainResponseDTO> searchTrains(String source, String destination) {
        List<TrainResponseDTO> trains = catalog.search(source, destination);
        if (trains.isEmpty()) {
            throw new com.example.booking_service.exception.TrainNotFoundException(
                    "No trains found for the given route.");
        }
        return trains;
    }

    public TrainResponseDTO getTrainById(Long trainId) {
        return catalog.findById(trainId).orElseThrow(
                () -> new com.example.booking_service.exception.TrainNotFoundException(
                        "Train not found with id: " + trainId));
    }

    public SeatAvailabilityResponseDTO getSeatAvailability(Long trainId) {
        try {
            return catalog.getSeatAvailability(trainId);
        } catch (RuntimeException ex) {
            throw new com.example.booking_service.exception.TrainNotFoundException(
                    "Train not found with id: " + trainId);
        }
    }
}
