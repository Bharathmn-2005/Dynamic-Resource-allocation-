# 🔐 Security Guide

This document outlines security best practices and implementation for the Train Ticket Booking System.

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Infrastructure Security](#infrastructure-security)
- [Incident Response](#incident-response)

## Authentication & Authorization

### JWT Token Management

**Token Structure**:
```
Header.Payload.Signature
```

**Implementation**:
```java
// JWT Configuration in Spring Security
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeRequests()
            .antMatchers("/auth/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(new JwtAuthenticationFilter(), 
                            UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

**Token Lifetime**:
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- Implement token rotation on every refresh

### Password Security

**Requirements**:
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

**Implementation**:
```java
@Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
private String password;
```

**Hashing**:
- Use BCrypt with minimum 12 rounds
- Never store plain text passwords

```java
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
String hashedPassword = encoder.encode(plainPassword);
```

## Data Protection

### Sensitive Data Handling

**PII (Personally Identifiable Information)**:
- Encryption at rest using AES-256
- Encryption in transit using TLS 1.3
- Minimal retention (delete after 30 days if inactive)

**Payment Data**:
- Never store credit card details
- Use PCI-DSS compliant payment gateway (Razorpay)
- Hash sensitive transaction IDs

### Database Security

**Access Control**:
```sql
-- Create application user with limited privileges
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM app_user;
```

**Encryption**:
- Enable SSL connections: `ssl = on` in postgresql.conf
- Encrypt backups: Use GPG encryption
- Store backup keys separately

### Secrets Management

**Environment Variables**:
- Store all secrets in environment variables, NOT in code
- Use `.env.example` as template only
- Never commit `.env` file to git

**Example .env**:
```bash
# ❌ WRONG - in source code
spring.mail.password=jgehvgwulfsxpgwz

# ✅ CORRECT - in environment
SPRING_MAIL_PASSWORD=${MAIL_PASSWORD}
```

## API Security

### CORS Configuration

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://your-domain.com")  // Production domain only
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("Authorization", "Content-Type")
            .maxAge(3600);
    }
}
```

### Rate Limiting

```java
@Configuration
public class RateLimitingConfig {
    @Bean
    public RateLimitingFilter rateLimitingFilter() {
        return new RateLimitingFilter()
            .limit("/auth/login", 5, Duration.ofMinutes(15))    // 5 attempts per 15 min
            .limit("/auth/register", 3, Duration.ofHours(1))    // 3 registrations per hour
            .limit("/api/payment", 10, Duration.ofMinutes(1));  // 10 payments per minute
    }
}
```

### Input Validation

```java
@PostMapping("/auth/register")
public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO dto) {
    // @Valid annotation automatically validates using Jakarta Validation
    
    // Additional sanitization
    String sanitizedEmail = sanitize(dto.getEmail());
    if (containsSQLInjection(sanitizedEmail)) {
        throw new SecurityException("Invalid input detected");
    }
    
    return ResponseEntity.ok(authService.register(dto));
}
```

### CSRF Protection

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            // ... other config
        return http.build();
    }
}
```

### Security Headers

```java
@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.setHeader("Content-Security-Policy", "default-src 'self'");
        
        filterChain.doFilter(request, response);
    }
}
```

## Infrastructure Security

### Docker Security

**Image Scanning**:
```bash
# Scan for vulnerabilities
docker scan auth-service:latest

# Use minimal base images
FROM eclipse-temurin:21-jre-alpine  # Only JRE, not JDK
```

**Secrets in Docker**:
```bash
# ❌ WRONG
docker run -e PASSWORD=secret123 myimage

# ✅ CORRECT
docker run --env-file .env.prod myimage
```

### Network Security

**Docker Compose Network**:
```yaml
services:
  auth-service:
    networks:
      - train_ticket_network
    # Service only accessible to other containers, not internet

  nginx:
    ports:
      - "443:443"  # Only nginx exposed to internet
    networks:
      - train_ticket_network
```

**Firewall Rules**:
```bash
# Only allow necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny from any to any port 8080  # Block direct service access
```

## SSL/TLS Configuration

### Certificate Management

```bash
# Use Let's Encrypt (free)
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot-renew.timer
```

### Nginx SSL Configuration

```nginx
ssl_protocols TLSv1.3 TLSv1.2;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

## Logging & Audit

### Security Logging

```java
@Component
public class AuditLogger {
    private static final Logger logger = LoggerFactory.getLogger(AuditLogger.class);
    
    public void logLoginAttempt(String username, boolean success, String ip) {
        logger.info("LOGIN_ATTEMPT username={} success={} ip={}", 
                   username, success, ip);
    }
    
    public void logPaymentCreated(String paymentId, String userId, BigDecimal amount) {
        logger.info("PAYMENT_CREATED paymentId={} userId={} amount={}", 
                   paymentId, userId, amount);
    }
    
    public void logSecurityViolation(String violation, String details) {
        logger.warn("SECURITY_VIOLATION type={} details={}", violation, details);
    }
}
```

### Log Retention

- Keep logs for minimum 90 days
- Store in secure, separate location
- Never log passwords, tokens, or PII

## Incident Response

### Security Breach Response

1. **Immediate Actions**:
   - Isolate affected systems
   - Stop all services if needed
   - Preserve logs for forensics

2. **Communication**:
   - Notify affected users
   - Inform stakeholders
   - Prepare public statement if needed

3. **Recovery**:
   - Restore from last known good backup
   - Rotate all credentials
   - Re-enable services gradually
   - Verify integrity

### Vulnerability Management

```bash
# Regular dependency checks
mvn dependency-check:check

# Keep dependencies updated
mvn versions:display-dependency-updates
```

## Compliance Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS/TLS for all communications
- [ ] Password hashing with BCrypt (≥12 rounds)
- [ ] JWT tokens with proper expiration
- [ ] CORS limited to trusted domains
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all APIs
- [ ] Security headers implemented
- [ ] Docker images scanned
- [ ] Database backups encrypted
- [ ] Access logs maintained
- [ ] Regular security audits scheduled

---

**Last Updated**: September 2026
**Security Team**: [Your Team]
