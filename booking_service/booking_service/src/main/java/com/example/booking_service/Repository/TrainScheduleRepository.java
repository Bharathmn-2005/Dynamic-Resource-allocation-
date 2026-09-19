package com.example.booking_service.Repository;

import com.example.booking_service.model.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface TrainScheduleRepository extends JpaRepository<TrainSchedule, Long> {
    Optional<TrainSchedule> findByTrainIdAndJourneyDate(Long trainId, LocalDate journeyDate);
    List<TrainSchedule> findByTrainId(Long trainId);
    List<TrainSchedule> findByJourneyDate(LocalDate journeyDate);
}
