package com.example.paymentservice.gateway;

import com.example.paymentservice.model.PaymentProvider;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Abstraction over an external payment gateway. Implementations are resolved
 * at runtime from configuration so the provider can be switched (SANDBOX for
 * local development, RAZORPAY for production) without changing service code.
 */
public interface PaymentGateway {

    PaymentProvider provider();

    /**
     * Creates a payment order with the external provider and returns the
     * provider's order reference. @param referenceId is our own unique id.
     */
    ProviderOrder createOrder(String referenceId, BigDecimal amount, String currency);

    /**
     * Verifies a webhook signature. Only used by gateways that deliver
     * asynchronous callbacks (e.g. Razorpay).
     */
    boolean verifyWebhook(String signature, String rawBody);

    /**
     * Encapsulates the provider response for a created order.
     */
    final class ProviderOrder {
        private final String providerOrderId;
        private final Map<String, Object> metadata;

        public ProviderOrder(String providerOrderId, Map<String, Object> metadata) {
            this.providerOrderId = providerOrderId;
            this.metadata = metadata;
        }

        public String getProviderOrderId() {
            return providerOrderId;
        }

        public Map<String, Object> getMetadata() {
            return metadata;
        }
    }
}