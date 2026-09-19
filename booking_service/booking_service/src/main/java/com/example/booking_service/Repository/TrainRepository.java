package com.example.booking_service.Repository;

import com.example.booking_service.model.TrainDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<TrainDetails, Long>{
    List<TrainDetails> findBySourceAndDestination(String source, String destination);
    Optional<TrainDetails> findByTrainNumber(Integer trainNumber);
}

