package com.example.paymentservice.gateway;

import com.example.paymentservice.model.PaymentProvider;
import org.junit.jupiter.api.Test;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifies the pure gateway logic (order creation + webhook signature
 * verification) without requiring a database or network access.
 */
class PaymentGatewayTest {

    @Test
    void sandboxGatewayCreatesOrder() {
        SandboxPaymentGateway gateway = new SandboxPaymentGateway();
        assertEquals(PaymentProvider.SANDBOX, gateway.provider());

        PaymentGateway.ProviderOrder order = gateway.createOrder(
                "PAY123", BigDecimal.valueOf(1200.00), "INR");

        assertTrue(order.getProviderOrderId().startsWith("sandbox_"));
        assertTrue(order.getProviderOrderId().length() > "sandbox_".length());
    }

    @Test
    void sandboxGatewayRejectsAllWebhooks() {
        SandboxPaymentGateway gateway = new SandboxPaymentGateway();
        assertFalse(gateway.verifyWebhook("anything", "{}"));
    }

    @Test
    void razorpayGatewayVerifiesValidSignature() throws Exception {
        String webhookSecret = "s3cret!key";
        String body = "{\"event\":\"payment.captured\"}";
        String expectedSignature = calculateSignature(body, webhookSecret);

        RazorpayPaymentGateway gateway = new RazorpayPaymentGateway("", "", webhookSecret);
        assertTrue(gateway.verifyWebhook(expectedSignature, body));
    }

    @Test
    void razorpayGatewayRejectsInvalidSignature() {
        RazorpayPaymentGateway gateway = new RazorpayPaymentGateway("", "", "s3cret!key");
        assertFalse(gateway.verifyWebhook("invalid-signature-value", "{\"event\":\"payment.captured\"}"));
    }

    private String calculateSignature(String body, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] rawHmac = mac.doFinal(body.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(rawHmac);
    }
}