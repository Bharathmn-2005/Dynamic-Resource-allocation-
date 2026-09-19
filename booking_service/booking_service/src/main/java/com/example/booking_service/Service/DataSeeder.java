package com.example.booking_service.Service;

import com.example.booking_service.Repository.*;
import com.example.booking_service.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Slf4j
@Component
public class DataSeeder {
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final TrainScheduleRepository trainScheduleRepository;

    public DataSeeder(TrainRepository trainRepository, 
                      StationRepository stationRepository,
                      TrainScheduleRepository trainScheduleRepository) {
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
        this.trainScheduleRepository = trainScheduleRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        try {
            log.info("Starting data seeding...");
            seedStations();
            seedTrainsAndSchedules();
            log.info("Data seeding completed successfully");
        } catch (Exception e) {
            log.error("Error during data seeding: ", e);
        }
    }

    private void seedStations() {
        if (stationRepository.count() > 0) {
            log.info("Stations already exist, skipping...");
            return;
        }

        List<Station> stations = Arrays.asList(
            new Station("NDLS", "Delhi", "Delhi"),
            new Station("CSMT", "Mumbai", "Mumbai"),
            new Station("SBC", "Bengaluru", "Bengaluru"),
            new Station("MAS", "Chennai", "Chennai"),
            new Station("SC", "Hyderabad", "Hyderabad"),
            new Station("HWH", "Kolkata", "Kolkata"),
            new Station("PUNE", "Pune", "Pune"),
            new Station("MYS", "Mysuru", "Mysuru"),
            new Station("ERS", "Kochi", "Kochi")
        );

        stationRepository.saveAll(stations);
        log.info("Seeded {} stations", stations.size());
    }

    private void seedTrainsAndSchedules() {
        if (trainRepository.count() > 0) {
            log.info("Trains already exist, skipping...");
            return;
        }

        List<TrainDetails> trains = createSampleTrains();
        List<TrainDetails> savedTrains = trainRepository.saveAll(trains);
        log.info("Seeded {} trains", savedTrains.size());

        LocalDate today = LocalDate.now();
        for (TrainDetails train : savedTrains) {
            for (int i = 0; i < 14; i++) {
                LocalDate journeyDate = today.plusDays(i);
                TrainSchedule schedule = new TrainSchedule(train.getId(), journeyDate, train.getTotalSeats());
                trainScheduleRepository.save(schedule);
            }
        }
        log.info("Seeded train schedules for next 14 days");
    }

    private List<TrainDetails> createSampleTrains() {
        List<TrainDetails> trains = new ArrayList<>();

        trains.add(createTrain(12001, "Vande Bharat Express", "NDLS", "CSMT", 
                              "06:45", "16:30", 875, 1443.0, 96, BigDecimal.valueOf(1240), TrainType.SHATABDI));
        
        trains.add(createTrain(22691, "Shatabdi Express", "MAS", "SBC",
                              "07:15", "11:55", 280, 320.0, 78, BigDecimal.valueOf(980), TrainType.SHATABDI));
        
        trains.add(createTrain(17005, "Rajdhani Express", "NDLS", "MAS",
                              "16:30", "07:05", 1925, 2145.0, 42, BigDecimal.valueOf(3640), TrainType.RAJDHANI));
        
        trains.add(createTrain(14001, "Duronto Express", "CSMT", "SBC",
                              "18:00", "06:00", 720, 845.0, 64, BigDecimal.valueOf(1580), TrainType.DURONTO));
        
        trains.add(createTrain(16334, "Superfast Express", "SBC", "MAS",
                              "10:30", "15:00", 270, 340.0, 96, BigDecimal.valueOf(650), TrainType.SUPERFAST));
        
        trains.add(createTrain(11001, "Express", "HWH", "MAS",
                              "08:00", "18:30", 630, 745.0, 120, BigDecimal.valueOf(1200), TrainType.EXPRESS));

        trains.add(createTrain(14567, "Passenger Express", "NDLS", "PUNE",
                              "12:00", "19:30", 450, 520.0, 128, BigDecimal.valueOf(890), TrainType.PASSENGER));

        trains.add(createTrain(18999, "Express Service", "CSMT", "HWH",
                              "20:00", "06:00", 600, 720.0, 96, BigDecimal.valueOf(1450), TrainType.EXPRESS));

        return trains;
    }

    private TrainDetails createTrain(int trainNumber, String trainName, String source, String destination,
                                     String departureTime, String arrivalTime, int durationMins, 
                                     double distanceKm, int totalSeats, BigDecimal fare, TrainType trainType) {
        TrainDetails train = new TrainDetails();
        train.setTrainNumber(trainNumber);
        train.setTrainName(trainName);
        train.setSource(source);
        train.setDestination(destination);

        LocalDate departureDate = LocalDate.now();
        LocalTime depTime = LocalTime.parse(departureTime);
        LocalTime arrTime = LocalTime.parse(arrivalTime);

        LocalDate arrivalDate = arrTime.isBefore(depTime) ? departureDate.plusDays(1) : departureDate;

        train.setDepartureTime(LocalDateTime.of(departureDate, depTime));
        train.setArrivalTime(LocalDateTime.of(arrivalDate, arrTime));
        train.setDurationInMinutes(durationMins);
        train.setDistanceKm(distanceKm);
        train.setTotalSeats(totalSeats);
        train.setAvailableSeats(totalSeats);
        train.setFare(fare);
        train.setTrainType(trainType);
        train.setStatus(TrainStatus.ACTIVE);

        return train;
    }
}
