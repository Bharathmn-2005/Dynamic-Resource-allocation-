package com.example.paymentservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Minimal application test that does not require a running database.
 */
@SpringBootTest
@ActiveProfiles("test")
class PaymentServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}