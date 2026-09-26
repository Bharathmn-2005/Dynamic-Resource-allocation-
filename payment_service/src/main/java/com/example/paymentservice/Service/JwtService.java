package com.example.paymentservice.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT validation for the Payment Service. Uses the same shared signing key as
 * the Authentication and Booking services so tokens issued by the auth service
 * are accepted here. The secret should be externalized via environment
 * variable in production; see application.properties for the override.
 */
@Service
public class JwtService {

    @org.springframework.beans.factory.annotation.Value("${JWT_SECRET}")
    private String jwtSecret;

    @org.springframework.beans.factory.annotation.Value("${JWT_EXPIRATION:86400000}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean isTokenValid(String token) {
        String email = extractEmail(token);
        return email != null && !email.isBlank() && !isTokenExpired(token);
    }
}