package com.example.paymentservice.gateway;

import com.example.paymentservice.exception.PaymentProcessingException;
import com.example.paymentservice.model.PaymentProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;

/**
 * Razorpay gateway integration. Requires the RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
 * environment variables. Webhook callbacks are verified using the Razorpay
 * HMAC-SHA256 signature mechanism before any payment status change is applied.
 */
@Component
public class RazorpayPaymentGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentGateway.class);
    private static final String BASE_URL = "https://api.razorpay.com/v1";

    private final RestClient restClient;
    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;

    public RazorpayPaymentGateway(
            @Value("${payment.provider.razorpay.key.id:}") String keyId,
            @Value("${payment.provider.razorpay.key.secret:}") String keySecret,
            @Value("${payment.provider.razorpay.webhook.secret:}") String webhookSecret) {
        this.keyId = keyId;
        this.keySecret = keySecret;
        this.webhookSecret = webhookSecret;
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public PaymentProvider provider() {
        return PaymentProvider.RAZORPAY;
    }

    @Override
    public ProviderOrder createOrder(String referenceId, BigDecimal amount, String currency) {
        if (keyId == null || keyId.isBlank() || keySecret == null || keySecret.isBlank()) {
            throw new PaymentProcessingException(
                    "Razorpay is selected as the payment provider but RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET are not configured.");
        }

        long amountPaise = amount.movePointRight(2).longValueExact();
        String body = "{\"amount\":" + amountPaise
                + ",\"currency\":\"" + currency
                + "\",\"receipt\":\"" + referenceId + "\"}";

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(keyId, keySecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            String response = restClient.post()
                    .uri("/orders")
                    .headers(h -> h.addAll(headers))
                    .body(body)
                    .retrieve()
                    .body(String.class);

            String orderId = extractOrderId(response);
            log.info("Razorpay order created for reference {}", referenceId);
            return new ProviderOrder(orderId, Map.of("raw", response));
        } catch (RestClientException ex) {
            log.error("Razorpay create order failed for reference {}: {}", referenceId, ex.getMessage());
            throw new PaymentProcessingException("Payment provider rejected the order request.", ex);
        } catch (RuntimeException ex) {
            throw new PaymentProcessingException("Payment provider returned an unexpected response.", ex);
        }
    }

    @Override
    public boolean verifyWebhook(String signature, String rawBody) {
        if (webhookSecret == null || webhookSecret.isBlank() || signature == null || signature.isBlank()) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec spec = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(spec);
            byte[] rawHmac = mac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));
            byte[] expected = Base64.getEncoder().encode(rawHmac);
            return MessageDigest.isEqual(expected, signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ex) {
            log.error("Razorpay webhook signature verification failed", ex);
            return false;
        }
    }

    private String extractOrderId(String json) {
        // Parse the "id" field defensively since we avoid a JSON dependency here.
        String marker = "\"id\":\"";
        int idx = json == null ? -1 : json.indexOf(marker);
        if (idx < 0) {
            throw new IllegalStateException("Razorpay response did not contain an order id");
        }
        int start = idx + marker.length();
        int end = json.indexOf('"', start);
        return json.substring(start, end);
    }
}