package com.example.paymentservice.config;

import com.example.paymentservice.gateway.PaymentGateway;
import com.example.paymentservice.gateway.RazorpayPaymentGateway;
import com.example.paymentservice.gateway.SandboxPaymentGateway;
import com.example.paymentservice.model.PaymentProvider;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

/**
 * Selects the active payment gateway from configuration.
 * Defaults to the in-process Sandbox gateway for safe local development.
 */
@Configuration
public class GatewayConfig {

    private static final Logger log = LoggerFactory.getLogger(GatewayConfig.class);

    private final String providerName;

    public GatewayConfig(@Value("${payment.provider:SANDBOX}") String providerName) {
        this.providerName = providerName == null ? "SANDBOX" : providerName.trim().toUpperCase();
    }

    @PostConstruct
    public void logProvider() {
        log.info("Active payment provider: {}", providerName);
    }

    @Bean
    public PaymentGateway paymentGateway(@Lazy RazorpayPaymentGateway razorpayPaymentGateway) {
        PaymentProvider provider = parseProvider();
        if (provider == PaymentProvider.RAZORPAY) {
            log.info("Using Razorpay payment gateway");
            return razorpayPaymentGateway;
        }
        log.info("Using Sandbox payment gateway");
        return new SandboxPaymentGateway();
    }

    private PaymentProvider parseProvider() {
        try {
            return PaymentProvider.valueOf(providerName);
        } catch (IllegalArgumentException e) {
            log.warn("Unknown payment.provider '{}', falling back to SANDBOX", providerName);
            return PaymentProvider.SANDBOX;
        }
    }
}