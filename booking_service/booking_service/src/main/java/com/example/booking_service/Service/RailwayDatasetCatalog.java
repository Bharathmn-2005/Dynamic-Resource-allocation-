package com.example.booking_service.Service;

import com.example.booking_service.DTO.SeatAvailabilityResponseDTO;
import com.example.booking_service.DTO.TrainResponseDTO;
import com.example.booking_service.model.TrainStatus;
import com.example.booking_service.model.TrainType;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RailwayDatasetCatalog {
    private static final Logger log = LoggerFactory.getLogger(RailwayDatasetCatalog.class);

    private final String datasetPath;
    private volatile List<TrainResponseDTO> trains = Collections.emptyList();

    public RailwayDatasetCatalog(@Value("${app.dataset.path}") String datasetPath) {
        this.datasetPath = datasetPath;
    }

    @PostConstruct
    public void init() {
        trains = loadTrains();
    }

    public List<TrainResponseDTO> search(String source, String destination) {
        String normalizedSource = normalizeStation(source);
        String normalizedDestination = normalizeStation(destination);

        return trains.stream()
                .filter(train -> matchesStation(train.getSource(), normalizedSource, source))
                .filter(train -> matchesStation(train.getDestination(), normalizedDestination, destination))
                .sorted((left, right) -> {
                    if (left.getDepartureTime() == null && right.getDepartureTime() == null) {
                        return Integer.compare(left.getTrainNumber(), right.getTrainNumber());
                    }
                    if (left.getDepartureTime() == null) return 1;
                    if (right.getDepartureTime() == null) return -1;
                    return left.getDepartureTime().compareTo(right.getDepartureTime());
                })
                .collect(Collectors.toList());
    }

    public Optional<TrainResponseDTO> findById(Long id) {
        return trains.stream().filter(train -> id.equals(train.getId())).findFirst();
    }

    public SeatAvailabilityResponseDTO getSeatAvailability(Long id) {
        TrainResponseDTO train = findById(id).orElseThrow(() -> new RuntimeException("Train not found."));
        int availableSeats = train.getAvailableSeats() != null ? train.getAvailableSeats() : 0;
        int totalSeats = train.getTotalSeats() != null ? train.getTotalSeats() : Math.max(availableSeats + 64, 128);

        return new SeatAvailabilityResponseDTO(
                train.getTrainNumber(),
                train.getTrainName(),
                totalSeats,
                availableSeats
        );
    }

    private List<TrainResponseDTO> loadTrains() {
        Resource resource = resolveDatasetResource();
        if (resource == null || !resource.exists()) {
            log.error("Railway dataset at '{}' could not be found on the classpath. No trains will be loaded.", datasetPath);
            return Collections.emptyList();
        }
        return parseDataset(resource);
    }

    private Resource resolveDatasetResource() {
        if (datasetPath == null || datasetPath.isBlank()) {
            log.warn("app.dataset.path is not configured; defaulting to classpath:railway-data.csv");
            return new ClassPathResource("railway-data.csv");
        }

        String location = datasetPath.trim();
        if (location.startsWith("file:classpath:")) {
            location = location.substring("file:classpath:".length());
        } else if (location.startsWith("classpath:")) {
            location = location.substring("classpath:".length());
        } else if (location.startsWith("file:")) {
            location = location.substring("file:".length());
        }

        if (location.startsWith("/") && location.length() >= 3 && Character.isLetter(location.charAt(1)) && location.charAt(2) == ':') {
            location = location.substring(1);
        }

        if (location.matches("^[A-Za-z]:[\\/].*")) {
            return new FileSystemResource(location);
        }

        while (location.startsWith("/")) {
            location = location.substring(1);
        }

        return new ClassPathResource(location);
    }

    private List<TrainResponseDTO> parseDataset(Resource resource) {
        Map<String, TrainResponseDTO> unique = new LinkedHashMap<>();

        try (InputStream inputStream = resource.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.trim().isEmpty()) {
                log.error("CSV '{}' is empty or has no header row. No trains loaded.", resource.getFilename());
                return Collections.emptyList();
            }

            Map<String, Integer> header = parseHeader(headerLine);
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.trim().isEmpty()) {
                    continue;
                }
                try {
                    TrainResponseDTO train = parseRow(line, header, lineNumber);
                    if (train != null) {
                        String key = train.getTrainNumber() + "|"
                                + train.getSource() + "|" + train.getDestination();
                        unique.putIfAbsent(key, train);
                    }
                } catch (Exception ex) {
                    log.error("Malformed data row {} in '{}' skipped: {}", lineNumber, resource.getFilename(), ex.getMessage());
                }
            }
        } catch (IOException ex) {
            log.error("Failed to read railway dataset '{}': {}", resource.getFilename(), ex.getMessage(), ex);
            return Collections.emptyList();
        }

        List<TrainResponseDTO> results = new ArrayList<>(unique.values());
        log.info("Loaded {} trains from railway-data.csv", results.size());
        return results;
    }

    private TrainResponseDTO parseRow(String line, Map<String, Integer> header, int lineNumber) {
        String[] columns = splitCsv(line);

        int trainNumber = safeParseInt(valueOr(columns, header, "trainnumber", "train number"), 0);
        String trainName = trimValue(valueOr(columns, header, "trainname", "train name"));
        String sourceValue = trimValue(valueOr(columns, header, "sourcestation", "source city", "source", "sourcecode"));
        String destinationValue = trimValue(valueOr(columns, header, "destinationstation", "destination city", "destination", "destinationcode"));

        if (trainNumber <= 0) {
            throw new IllegalArgumentException("trainNumber is missing or invalid");
        }
        if (sourceValue.isBlank()) {
            throw new IllegalArgumentException("source is missing");
        }
        if (destinationValue.isBlank()) {
            throw new IllegalArgumentException("destination is missing");
        }

        String journeyDateRaw = trimValue(valueOr(columns, header, "date of journey", "journeydate"));
        String travelTimeRaw = trimValue(valueOr(columns, header, "travel time", "traveltime", "traveldurationminutes"));
        String distanceRaw = trimValue(valueOr(columns, header, "travel distance", "distancekm", "traveldistance"));
        String availableSeatsRaw = trimValue(valueOr(columns, header, "seat availability", "availableseats"));
        String totalSeatsRaw = trimValue(valueOr(columns, header, "seat availability", "totalseats", "seats available"));
        String fareRaw = trimValue(valueOr(columns, header, "fare"));
        String trainTypeRaw = trimValue(valueOr(columns, header, "train type", "traintype"));
        String statusRaw = trimValue(valueOr(columns, header, "current status", "status"));

        LocalDate journeyDate = safeParseDate(journeyDateRaw, LocalDate.now());
        int durationMinutes = safeParseInt(travelTimeRaw, 0);
        int availableSeats = safeParseInt(availableSeatsRaw, 0);
        int totalSeats = safeParseInt(totalSeatsRaw, Math.max(availableSeats, 100));

        String source = sourceValue;
        String destination = destinationValue;
        LocalDateTime departureTime = LocalDateTime.of(journeyDate, LocalTime.of(6, 0));
        LocalDateTime arrivalTime = departureTime.plusMinutes(Math.max(durationMinutes, 1));

        TrainResponseDTO dto = new TrainResponseDTO();
        dto.setId((long) lineNumber);
        dto.setTrainNumber(trainNumber);
        dto.setTrainName(!trainName.isBlank() ? trainName : ("Train " + trainNumber));
        dto.setSource(source);
        dto.setDestination(destination);
        dto.setDepartureTime(departureTime);
        dto.setArrivalTime(arrivalTime);
        dto.setDurationInMinutes(Math.max(durationMinutes, 0));
        dto.setDistanceKm(safeParseDouble(distanceRaw, 0.0));
        dto.setAvailableSeats(availableSeats > 0 ? availableSeats : Math.max(totalSeats - 30, 1));
        dto.setTotalSeats(totalSeats);
        dto.setFare(safeParseBigDecimal(fareRaw, derivedFareFromDistance(distanceRaw, trainNumber)));
        dto.setTrainType(resolveTrainType(trainTypeRaw));
        dto.setRacCount(0);
        dto.setWaitlistCount(0);

        if ("CANCELLED".equalsIgnoreCase(statusRaw) || statusRaw.contains("cancel")) {
            dto.setTrainStatus(TrainStatus.CANCELLED);
        } else if ("MAINTENANCE".equalsIgnoreCase(statusRaw) || statusRaw.contains("maint")) {
            dto.setTrainStatus(TrainStatus.MAINTENANCE);
        } else {
            dto.setTrainStatus(TrainStatus.ACTIVE);
        }
        return dto;
    }

    private static String valueOr(String[] columns, Map<String, Integer> header, String... names) {
        for (String name : names) {
            String value = column(columns, header, name);
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return "";
    }

    private static BigDecimal derivedFareFromDistance(String distanceRaw, int trainNumber) {
        double distance = safeParseDouble(distanceRaw, 0.0);
        if (distance <= 0) {
            return BigDecimal.valueOf(Math.max(120.0, trainNumber % 50 + 250));
        }
        return BigDecimal.valueOf(Math.max(180.0, distance * 0.85));
    }

    private static String trimValue(String value) {
        return value == null ? "" : value.trim();
    }

    private static BigDecimal safeParseBigDecimal(String value, BigDecimal fallback) {
        try {
            if (value == null || value.trim().isEmpty()) {
                return fallback;
            }
            return new BigDecimal(value.trim());
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private static LocalTime safeParseTime(String value, LocalTime fallback) {
        try {
            return LocalTime.parse(value.trim());
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private static Map<String, Integer> parseHeader(String headerLine) {
        String[] names = splitCsv(headerLine);
        Map<String, Integer> header = new LinkedHashMap<>();
        for (int index = 0; index < names.length; index++) {
            header.putIfAbsent(names[index].trim().toLowerCase(Locale.ROOT), index);
        }
        return header;
    }

    private static String column(String[] columns, Map<String, Integer> header, String name) {
        Integer index = header.get(name.toLowerCase(Locale.ROOT));
        if (index == null || index >= columns.length) {
            return "";
        }
        return columns[index];
    }

    private static String[] splitCsv(String line) {
        List<String> columns = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean quoted = false;

        for (int index = 0; index < line.length(); index++) {
            char character = line.charAt(index);
            if (character == '"') {
                quoted = !quoted;
                continue;
            }

            if (character == ',' && !quoted) {
                columns.add(current.toString());
                current.setLength(0);
            } else {
                current.append(character);
            }
        }
        columns.add(current.toString());
        return columns.toArray(String[]::new);
    }

    private static int safeParseInt(String value, int fallback) {
        try {
            String clean = value.replaceAll("[^0-9-]", "");
            if (clean.isBlank()) {
                return fallback;
            }
            return Integer.parseInt(clean);
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private static double safeParseDouble(String value, double fallback) {
        try {
            String clean = value.replaceAll("[^0-9.-]", "");
            if (clean.isBlank()) {
                return fallback;
            }
            return Double.parseDouble(clean);
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private static LocalDate safeParseDate(String value, LocalDate fallback) {
        try {
            return LocalDate.parse(value);
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private static TrainType resolveTrainType(String value) {
        String normalized = value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "RAJDHANI" -> TrainType.RAJDHANI;
            case "SHATABDI" -> TrainType.SHATABDI;
            case "DURONTO" -> TrainType.DURONTO;
            case "SUPERFAST" -> TrainType.SUPERFAST;
            case "PASSENGER" -> TrainType.PASSENGER;
            default -> TrainType.EXPRESS;
        };
    }

    private static String normalizeStation(String value) {
        if (value == null) {
            return "";
        }

        String trimmed = value.trim().toUpperCase(Locale.ROOT);
        return switch (trimmed) {
            case "BANGALORE", "BENGALURU", "SBC", "SMVB" -> "BENGALURU";
            case "CHENNAI", "MAS", "MS" -> "CHENNAI";
            case "MUMBAI", "CSMT", "MMCT", "LTT", "BDTS" -> "MUMBAI";
            case "DELHI", "NDLS", "DLI", "NZM", "ANVT" -> "DELHI";
            case "HYDERABAD", "SC", "KCG", "HYB" -> "HYDERABAD";
            case "KOLKATA", "HWH", "KOAA", "SDAH" -> "KOLKATA";
            case "PUNE", "PUNE JN" -> "PUNE";
            case "MYSURU", "MYS", "MYSORE" -> "MYSURU";
            case "KOCHI", "ERS", "ERSD", "KOC" -> "KOCHI";
            default -> trimmed;
        };
    }

    private static String resolveStationName(String stationCode) {
        if (stationCode == null || stationCode.isBlank()) {
            return "Unknown";
        }

        String normalized = stationCode.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "NDLS", "DLI", "NZM", "ANVT" -> "Delhi";
            case "CSMT", "MMCT", "LTT", "BDTS" -> "Mumbai";
            case "SBC", "SMVB" -> "Bengaluru";
            case "MAS", "MS" -> "Chennai";
            case "SC", "KCG", "HYB" -> "Hyderabad";
            case "HWH", "KOAA", "SDAH" -> "Kolkata";
            case "PUNE" -> "Pune";
            case "MYS", "MYSORE" -> "Mysuru";
            case "ERS", "ERSD", "KOC" -> "Kochi";
            default -> stationCode.trim();
        };
    }

    private static boolean matchesStation(String candidate, String normalizedSearch, String rawSearch) {
        if (normalizedSearch == null || normalizedSearch.isBlank()) {
            return true;
        }

        String normalizedCandidate = normalizeStation(candidate);
        String rawCandidate = candidate == null ? "" : candidate.trim().toUpperCase(Locale.ROOT);
        String normalizedRawSearch = rawSearch == null ? "" : rawSearch.trim().toUpperCase(Locale.ROOT);

        return normalizedCandidate.contains(normalizedSearch)
                || rawCandidate.contains(normalizedSearch)
                || rawCandidate.contains(normalizedRawSearch)
                || normalizedCandidate.contains(normalizedRawSearch);
    }
}