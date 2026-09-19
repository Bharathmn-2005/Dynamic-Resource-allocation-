package com.example.booking_service.Repository;

import com.example.booking_service.model.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<BookingEntity , Long> {
    List<BookingEntity> findByUserEmail(String userEmail);
    List<BookingEntity> findByUserId(Long userId);
    List<BookingEntity> findByTrainIdAndJourneyDate(Long trainId, LocalDate journeyDate);
    Optional<BookingEntity> findByPnr(String pnr);
    List<BookingEntity> findByJourneyDateAndTicketPdfSentAtIsNull(LocalDate journeyDate);
}

