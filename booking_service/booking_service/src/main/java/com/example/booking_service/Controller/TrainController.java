package com.example.booking_service.Controller;

import com.example.booking_service.DTO.SeatAvailabilityResponseDTO;
import com.example.booking_service.DTO.TrainResponseDTO;
import com.example.booking_service.DTO.TrainSearchResultDTO;
import com.example.booking_service.Service.TrainService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {
    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainSearchResultDTO>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate journeyDate,
            @RequestParam(required = false) Integer trainNumber) {

        return ResponseEntity.ok(trainService.searchTrains(source, destination, journeyDate, trainNumber));
    }

    @GetMapping("/{trainId}")
    public ResponseEntity<TrainResponseDTO> getTrainById(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getTrainById(trainId));
    }

    @GetMapping("/{trainId}/availability")
    public ResponseEntity<SeatAvailabilityResponseDTO> getSeatAvailability(@PathVariable Long trainId) {
        return ResponseEntity.ok(trainService.getSeatAvailability(trainId));
    }
}
