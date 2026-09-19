package com.example.booking_service.Repository;

import com.example.booking_service.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {
    Optional<NotificationLog> findByPnrAndEventType(String pnr, String eventType);
    List<NotificationLog> findByBookingIdAndEventType(Long bookingId, String eventType);
    List<NotificationLog> findByStatusAndRetryCountLessThan(String status, Integer maxRetries);
    Optional<NotificationLog> findByPnr(String pnr);
}
