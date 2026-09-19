package com.example.booking_service.Controller;
import com.example.booking_service.DTO.SeatAvailabilityResponseDTO;
import com.example.booking_service.DTO.TrainResponseDTO;
import com.example.booking_service.Service.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trains")
public class TrainController {
    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }
    @GetMapping("/search")
    //eslaticsearch
    public ResponseEntity<List<TrainResponseDTO>> searchTrains(
            @RequestParam String source,
            @RequestParam String destination) {

        return ResponseEntity.ok(
                trainService.searchTrains(source, destination)
        );
    }

    @GetMapping("/{trainId}")
    public ResponseEntity<TrainResponseDTO> getTrainById(
            @PathVariable Long trainId) {

        return ResponseEntity.ok(
                trainService.getTrainById(trainId)
        );
    }
    @GetMapping("/{trainId}/availability")
    public ResponseEntity<SeatAvailabilityResponseDTO> getSeatAvailability(
            @PathVariable Long trainId) {

        return ResponseEntity.ok(
                trainService.getSeatAvailability(trainId)
        );
    }
}
