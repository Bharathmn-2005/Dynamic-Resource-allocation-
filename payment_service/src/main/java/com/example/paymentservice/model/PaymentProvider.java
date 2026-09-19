package com.example.paymentservice.model;

/**
 * Supported payment providers. Provider names are resolved at runtime from the
 * configured gateway (SANDBOX or RAZORPAY).
 */
public enum PaymentProvider {
    SANDBOX,
    RAZORPAY
}