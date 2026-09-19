package com.example.booking_service.Service;

import com.example.booking_service.DTO.SeatAvailabilityResponseDTO;
import com.example.booking_service.DTO.TrainResponseDTO;
import com.example.booking_service.DTO.TrainSearchResultDTO;
import com.example.booking_service.Repository.TrainRepository;
import com.example.booking_service.model.TrainDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrainService {
    private final TrainRepository trainRepository;
    private final ElasticsearchTrainSearchService elasticsearchTrainSearchService;

    public TrainService(TrainRepository trainRepository, ElasticsearchTrainSearchService elasticsearchTrainSearchService) {
        this.trainRepository = trainRepository;
        this.elasticsearchTrainSearchService = elasticsearchTrainSearchService;
    }

    public List<TrainSearchResultDTO> searchTrains(String source, String destination, LocalDate journeyDate, Integer trainNumber) {
        return elasticsearchTrainSearchService.search(source, destination, journeyDate, trainNumber);
    }

    public TrainResponseDTO getTrainById(Long trainId) {
        TrainDetails train = trainRepository.findById(trainId).orElseThrow(
                () -> new com.example.booking_service.exception.TrainNotFoundException("Train not found with id: " + trainId));

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
        dto.setTotalSeats(train.getTotalSeats());
        dto.setFare(train.getFare());
        dto.setTrainType(train.getTrainType());
        dto.setTrainStatus(train.getStatus());
        return dto;
    }

    public SeatAvailabilityResponseDTO getSeatAvailability(Long trainId) {
        TrainDetails train = trainRepository.findById(trainId).orElseThrow(
                () -> new com.example.booking_service.exception.TrainNotFoundException("Train not found with id: " + trainId));

        return new SeatAvailabilityResponseDTO(
                train.getTrainNumber(),
                train.getTrainName(),
                train.getTotalSeats(),
                train.getAvailableSeats()
        );
    }
}
