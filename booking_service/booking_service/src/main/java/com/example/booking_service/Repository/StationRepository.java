package com.example.booking_service.Repository;

import com.example.booking_service.model.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {
    Optional<Station> findByStationCode(String stationCode);
    Optional<Station> findByStationName(String stationName);
}
