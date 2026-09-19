package com.example.booking_service;

import com.example.booking_service.Service.CsvTrainSearchImporter;
import com.example.booking_service.model.TrainSearchDocument;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class CsvTrainSearchImporterTest {

    @Test
    void importCsv_readsValidRowsAndIndexesThem() throws IOException {
        Path tempCsv = Files.createTempFile("train-search", ".csv");
        Files.writeString(tempCsv, String.join(System.lineSeparator(),
                "PNR Number,Train Number,Date of Journey,Class of Travel,Quota,Source Station,Destination Station,Booking Date,Current Status,Number of Passengers,Age of Passengers,Booking Channel,Travel Distance,Number of Stations,Travel Time,Train Type,Seat Availability,Special Considerations,Holiday or Peak Season,Waitlist Position,Confirmation Status",
                "PNR0000000000,51450,2024-09-01,3AC,General,Adderi,Adichunchanagiri,2024-01-01,Confirmed,4,Child,Counter,1656,17,37,Shatabdi,159,Senior Citizen,Yes,,Confirmed",
                "PNR0000000001,54807,2024-09-02,3AC,Premium Tatkal,Adichunchanagiri,Adihalli,2024-01-02,Waitlisted,5,Senior Citizen,Mobile App,1932,18,6,Shatabdi,309,,Yes,WL097,Not Confirmed",
                "PNR0000000002,14396,2024-09-03,3AC,Ladies,Adihalli,Akkihebbalu,2024-01-03,RAC,5,Adult,IRCTC Website,155,4,17,Express,143,,Yes,,Confirmed"
        ));

        ElasticsearchOperations elasticsearchOperations = Mockito.mock(ElasticsearchOperations.class);
        IndexOperations indexOperations = Mockito.mock(IndexOperations.class);
        when(elasticsearchOperations.indexOps(TrainSearchDocument.class)).thenReturn(indexOperations);
        when(indexOperations.exists()).thenReturn(true);
        when(elasticsearchOperations.bulkIndex(anyList(), eq(TrainSearchDocument.class))).thenReturn(Collections.emptyList());

        CsvTrainSearchImporter importer = new CsvTrainSearchImporter(
                elasticsearchOperations,
                true,
                false,
                false,
                "file:" + tempCsv
        );

        int indexed = importer.importCsv();
        assertEquals(3, indexed);
    }

    @Test
    void importCsv_reportsMalformedRowsWithoutCrashing() throws IOException {
        Path tempCsv = Files.createTempFile("train-search-malformed", ".csv");
        Files.writeString(tempCsv, String.join(System.lineSeparator(),
                "PNR Number,Train Number,Date of Journey,Class of Travel,Quota,Source Station,Destination Station,Booking Date,Current Status,Number of Passengers,Age of Passengers,Booking Channel,Travel Distance,Number of Stations,Travel Time,Train Type,Seat Availability,Special Considerations,Holiday or Peak Season,Waitlist Position,Confirmation Status",
                "PNR0000000000,51450,2024-09-01,3AC,General,Adderi,Adichunchanagiri,2024-01-01,Confirmed,4,Child,Counter,1656,17,37,Shatabdi,159,Senior Citizen,Yes,,Confirmed",
                "BAD_PNR,invalid,not-a-date,3AC,General,Adderi,Adichunchanagiri,2024-01-01,Confirmed,4,Child,Counter,1656,17,37,Shatabdi,159,Senior Citizen,Yes,,Confirmed"
        ));

        ElasticsearchOperations elasticsearchOperations = Mockito.mock(ElasticsearchOperations.class);
        IndexOperations indexOperations = Mockito.mock(IndexOperations.class);
        when(elasticsearchOperations.indexOps(TrainSearchDocument.class)).thenReturn(indexOperations);
        when(indexOperations.exists()).thenReturn(true);
        when(elasticsearchOperations.bulkIndex(anyList(), eq(TrainSearchDocument.class))).thenReturn(Collections.emptyList());

        CsvTrainSearchImporter importer = new CsvTrainSearchImporter(
                elasticsearchOperations,
                true,
                false,
                false,
                "file:" + tempCsv
        );

        int indexed = importer.importCsv();
        assertEquals(1, indexed);
    }
}
