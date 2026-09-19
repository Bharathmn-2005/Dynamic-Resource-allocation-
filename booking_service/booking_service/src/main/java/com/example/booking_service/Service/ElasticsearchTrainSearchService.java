package com.example.booking_service.Service;

import com.example.booking_service.DTO.TrainSearchResultDTO;
import com.example.booking_service.Repository.TrainRepository;
import com.example.booking_service.model.TrainDetails;
import com.example.booking_service.model.TrainSearchDocument;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class ElasticsearchTrainSearchService {
    private static final Logger log = LoggerFactory.getLogger(ElasticsearchTrainSearchService.class);

    private final ElasticsearchOperations elasticsearchOperations;
    private final TrainRepository trainRepository;

    public ElasticsearchTrainSearchService(ElasticsearchOperations elasticsearchOperations, TrainRepository trainRepository) {
        this.elasticsearchOperations = elasticsearchOperations;
        this.trainRepository = trainRepository;
    }

    public List<TrainSearchResultDTO> search(String source, String destination, LocalDate journeyDate, Integer trainNumber) {
        List<Query> filters = new ArrayList<>();

        if (source != null && !source.isBlank()) {
            String normalized = normalizeStation(source);
            filters.add(Query.of(q -> q.term(t -> t.field("sourceStationNormalized").value(normalized))));
        }

        if (destination != null && !destination.isBlank()) {
            String normalized = normalizeStation(destination);
            filters.add(Query.of(q -> q.term(t -> t.field("destinationStationNormalized").value(normalized))));
        }

        if (journeyDate != null) {
            filters.add(Query.of(q -> q.term(t -> t.field("journeyDate").value(journeyDate.toString()))));
        }

        if (trainNumber != null) {
            filters.add(Query.of(q -> q.term(t -> t.field("trainNumber").value(trainNumber))));
        }

        NativeQuery nativeQuery = NativeQuery.builder()
                .withQuery(q -> q.bool(boolQueryBuilder -> boolQueryBuilder.filter(filters)))
                .build();

        SearchHits<TrainSearchDocument> hits = elasticsearchOperations.search(nativeQuery, TrainSearchDocument.class);
        List<TrainSearchResultDTO> results = new ArrayList<>();
        for (var hit : hits) {
            TrainSearchDocument document = hit.getContent();
            if (document == null) {
                continue;
            }
            results.add(toSearchResult(document));
        }

        return results;
    }

    private TrainSearchResultDTO toSearchResult(TrainSearchDocument document) {
        TrainSearchResultDTO dto = new TrainSearchResultDTO();
        dto.setRecordId(document.getPnrNumber());
        dto.setTrainNumber(document.getTrainNumber());
        dto.setSource(document.getSourceStation());
        dto.setDestination(document.getDestinationStation());
        dto.setJourneyDate(document.getJourneyDate());
        dto.setClassOfTravel(document.getClassOfTravel());
        dto.setQuota(document.getQuota());
        dto.setBookingDate(document.getBookingDate());
        dto.setCurrentStatus(document.getCurrentStatus());
        dto.setNumberOfPassengers(document.getNumberOfPassengers());
        dto.setAgeOfPassengers(document.getAgeOfPassengers());
        dto.setBookingChannel(document.getBookingChannel());
        dto.setTravelDistance(document.getTravelDistance());
        dto.setNumberOfStations(document.getNumberOfStations());
        dto.setTravelTime(document.getTravelTime());
        dto.setTrainType(document.getTrainType());
        dto.setSeatAvailability(document.getSeatAvailability());
        dto.setSpecialConsiderations(document.getSpecialConsiderations());
        dto.setHolidayOrPeakSeason(document.getHolidayOrPeakSeason());
        dto.setWaitlistPosition(document.getWaitlistPosition());
        dto.setConfirmationStatus(document.getConfirmationStatus());

        Optional<TrainDetails> trainDetails = trainRepository.findByTrainNumber(document.getTrainNumber());
        if (trainDetails.isPresent()) {
            dto.setBookable(true);
            dto.setBookableTrainId(trainDetails.get().getId());
        } else {
            dto.setBookable(false);
            dto.setBookableTrainId(null);
        }
        return dto;
    }

    private static String normalizeStation(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
