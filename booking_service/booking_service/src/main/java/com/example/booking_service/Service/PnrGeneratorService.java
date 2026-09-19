package com.example.booking_service.Service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class PnrGeneratorService {
    private final AtomicLong counter = new AtomicLong(1000);

    public String generatePnr() {
        long timestamp = System.currentTimeMillis() / 1000;
        long sequence = counter.incrementAndGet();
        String pnr = String.format("%010d%05d", timestamp % 10000000000L, sequence % 100000);
        return pnr.substring(0, 10);
    }
}
