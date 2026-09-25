# AUTH SERVICE DEPLOYMENT READINESS AUDIT REPORT

## PHASE 1 — AUDIT SUMMARY

**Generated**: 2026-09-25
**Service**: Authentication Service (Port 8080)
**Repository**: Train Ticket Booking System
**Target Environment**: AWS EC2 + Docker + ECR

---

## 1. CURRENT STATUS

### Project Structure: ✅ READY
- Maven multi-module project structure is well organized
- Proper package hierarchy
- Separation of concerns (controller, service, repository, filter, exception, config, DTO)

### Build Configuration (pom.xml): ✅ READY
- Spring Boot 4.1.0 parent (latest stable for Java 21)
- Java 21 target version confirmed
- All required dependencies present:
  - spring-boot-starter-data-jpa
  - spring-boot-starter-security
  - spring-boot-starter-mail
  - spring-boot-starter-actuator
  - spring-boot-starter-webmvc
  - spring-boot-starter-validation
  - jjwt (JWT library, version 0.12.6)
  - postgresql driver
- Maven plugins configured correctly

### Code Quality: ✅ MOSTLY READY (with minor improvements needed)
- Proper Spring annotations (@Service, @Component, @RestController, @Configuration)
- Dependency injection implemented correctly
- Exception handling via GlobalExceptionHandler
- Security configuration present and well-structured

---

## 2. CRITICAL ISSUES FOUND

### Issue 1: CRITICAL - Hard-coded Secret in Password Reset Email Link
**Severity**: CRITICAL
**File**: `src/main/java/com/example/authentication_module/Service/EmailSenderService.java:75`
**Problem**: 
```java
// Line 75 - HARD-CODED URL with localhost
"http://localhost:8080/auth/reset-password?token=" + token
```
This creates a hard-coded URL pointing to localhost, which will not work in Docker or production. Frontend URL is already parameterized but this one is not.

**Impact**: Password reset emails sent to users will contain a broken link when deployed to Docker/AWS. Users cannot reset passwords.

**Required Fix**: Use the frontend base URL (already available) instead of hard-coded localhost:
```java
String resetUrl = frontendBaseUrl + "/reset-password?token=" + token;
```

---

### Issue 2: CRITICAL - Loose Exception Handling in JWT Filter
**Severity**: CRITICAL
**File**: `src/main/java/com/example/authentication_module/Filter/JwtAuthenticationFilter.java:79-82`
**Problem**:
```java
} catch (Exception ex) {
    // Fail open: log and continue...
    System.err.println("JWT processing failed: " + ex.getMessage());
}
```
- Catches all exceptions broadly (including auth failures, expired tokens, invalid signatures)
- Prints to System.err which is logged
- Silently continues without proper logging or security context
- No distinction between expected (token expired) and unexpected errors

**Impact**: 
- Authentication failures are silently ignored
- Protected endpoints may be accessible without valid credentials in edge cases
- Difficult to debug security issues
- Not suitable for production monitoring

**Required Fix**: Use proper logging framework, handle specific exceptions differently, ensure auth context is cleared on failure:
```java
} catch (io.jsonwebtoken.ExpiredJwtException e) {
    log.debug("JWT token expired");
    SecurityContextHolder.clearContext();
} catch (io.jsonwebtoken.MalformedJwtException e) {
    log.warn("Malformed JWT token");
    SecurityContextHolder.clearContext();
} catch (Exception e) {
    log.error("JWT processing error", e);
    SecurityContextHolder.clearContext();
}
```

---

### Issue 3: HIGH - Runtime Exception Thrown (Not Custom Exception)
**Severity**: HIGH
**File**: `src/main/java/com/example/authentication_module/controller/ProfileController.java:31`
**Problem**:
```java
UserModel user = userRepository.findByEmail(email)
    .orElseThrow(() -> new RuntimeException("User not found"));
```
Throws generic RuntimeException instead of using custom exception.

**Impact**: 
- GlobalExceptionHandler doesn't catch RuntimeException specifically
- Returns 500 Internal Server Error instead of appropriate 4xx response
- Inconsistent error handling across application
- Stack traces may be exposed to clients

**Required Fix**: Use existing `UserNotFoundException`:
```java
UserModel user = userRepository.findByEmail(email)
    .orElseThrow(() -> new UserNotFoundException("User not found"));
```

---

## 3. HIGH-PRIORITY ISSUES FOUND

### Issue 4: HIGH - Improper HTTP Status Codes
**Severity**: HIGH
**File**: `src/main/java/com/example/authentication_module/controller/UserController.java:38`
**Problem**:
```java
// Line 38 - Returning 201 CREATED for login response
return ResponseEntity.status(HttpStatus.CREATED).body(response);
```
Login should return 200 OK, not 201 CREATED. 201 CREATED is for resource creation (registration).

**Impact**: API clients may misinterpret successful login as resource creation. RESTful API contract violation.

**Required Fix**: Change login response to HTTP 200 OK:
```java
return ResponseEntity.ok(response);
```

---

### Issue 5: HIGH - Weak Error Messages in GlobalExceptionHandler
**Severity**: HIGH
**File**: `src/main/java/com/example/authentication_module/Exception/GlobalExceptionHandler.java`
**Problems**:
1. Wrong exception type in `handleEmailNotVerified` (line 60):
   ```java
   public ResponseEntity<ErrorResponse> handleEmailNotVerified(EmailAlreadyexistsException ex, ...)
   ```
   Should be `EmailNotVerifiedException` not `EmailAlreadyexistsException`.

2. Multiple handlers return CONFLICT (409) for different scenarios:
   - Password mismatch should be 400 BAD_REQUEST
   - Account locked should be 403 FORBIDDEN or 401 UNAUTHORIZED
   - User not found should be 404 NOT_FOUND
   - User already exists should be 409 CONFLICT ✓
   - Email already exists should be 409 CONFLICT ✓
   - Invalid credentials should be 401 UNAUTHORIZED

**Impact**: Incorrect HTTP status codes confuse API clients. Security issue: leaking information about whether account exists.

---

### Issue 6: HIGH - Logging Concerns
**Severity**: HIGH
**File**: Multiple locations (UserService, EmailSenderService, JwtAuthenticationFilter)
**Problems**:
- Using `System.out.println()` and `System.err.println()` instead of proper logging
- Logging may contain sensitive information (user registration details, token generation)
- No SLF4J or Logback configuration visible
- In production, System.err output may not be captured or may go to wrong stream

**Impact**: 
- Logs may be missed or improperly captured
- Difficult to configure log levels or output format per environment
- Potential for security log exposure

**Required Fix**: Use SLF4J logger:
```java
private static final Logger log = LoggerFactory.getLogger(UserService.class);
log.debug("Registration started for email: {}", requestDTO.getEmail());
```

---

## 4. MEDIUM-PRIORITY ISSUES FOUND

### Issue 7: MEDIUM - Database Operations Need Transactional Safety
**Severity**: MEDIUM
**File**: `src/main/java/com/example/authentication_module/Service/UserService.java`
**Problem**: 
- `verifyEmail` endpoint creates UserModel from PendingRegistration without explicit transaction management
- Multiple database operations are not atomic

**Impact**: Race conditions possible if multiple verification requests arrive simultaneously.

---

### Issue 8: MEDIUM - Refresh Token Validation Error Messages
**Severity**: MEDIUM
**File**: `src/main/java/com/example/authentication_module/Service/RefreshTokenService.java:48,50,54`
**Problem**: 
Throws generic RuntimeException instead of custom exceptions.

**Impact**: Cannot be caught by GlobalExceptionHandler, returns 500 errors instead of 4xx.

---

### Issue 9: MEDIUM - CORSConfiguration Not Visible
**Severity**: MEDIUM
**File**: SecurityFilterChain appears to allow all OPTIONS requests but no dedicated CORS config bean
**Problem**: 
```java
.requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
```
This is not a robust CORS setup. No CorsConfigurationSource bean defined.

**Impact**: CORS may not work correctly with credentials, preflight, or specific headers.

---

### Issue 10: MEDIUM - Email Verification Token Not Cleaned Up
**Severity**: MEDIUM
**File**: Database schema and verification logic
**Problem**: 
Expired email verification tokens are not automatically deleted from database.

**Impact**: Database grows indefinitely with old tokens.

---

## 5. LOW-PRIORITY ISSUES FOUND

### Issue 11: LOW - Missing Constants
**Severity**: LOW
**Problem**: Magic numbers/strings scattered (e.g., "24" hours in token expiry, "7" days in refresh token expiry)

**Impact**: Difficult to maintain, scattered configuration.

---

### Issue 12: LOW - Limited Test Coverage
**Severity**: LOW
**File**: `src/test/java/com/example/authentication_module/AuthenticationModuleApplicationTests.java`
**Problem**: Only contains a basic context load test
**Impact**: No unit or integration tests for authentication logic

---

## 6. DOCKER AND DEPLOYMENT ISSUES

### Issue 13: HIGH - Dockerfile Needs Non-Root User
**Severity**: HIGH
**File**: `Dockerfile`
**Problem**: 
- No USER directive
- Container runs as root by default
- This is a security risk

**Fix**: Add non-root user:
```dockerfile
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser
USER appuser
```

---

### Issue 14: HIGH - Missing .dockerignore File
**Severity**: HIGH
**Problem**: 
No .dockerignore file exists. This means unnecessary files are included in Docker build context.

**Impact**: Slower builds, larger images, potential secrets inclusion.

**Fix**: Create `.dockerignore` file at project root.

---

### Issue 15: MEDIUM - Health Check May Fail Before App Fully Ready
**Severity**: MEDIUM
**File**: Dockerfile HEALTHCHECK
**Problem**: 
Default health check starts at 40 seconds, but app may need more time to initialize with cold PostgreSQL connection.

**Impact**: Container may be marked unhealthy before app is ready.

---

## 7. CONFIGURATION ISSUES

### Issue 16: MEDIUM - Overly Verbose Logging Configuration
**Severity**: MEDIUM
**File**: `application.properties`
**Problem**:
```
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.mail=DEBUG
```
These are DEBUG level in production properties.

**Impact**: May leak security-sensitive information in logs.

**Required Fix**: Change to INFO level:
```
logging.level.org.springframework.security=INFO
logging.level.org.springframework.mail=INFO
```

---

### Issue 17: MEDIUM - Actuator Endpoints Over-Exposed
**Severity**: MEDIUM
**File**: `application.properties`
**Problem**:
```
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```
`show-details=always` exposes detailed health information.

**Impact**: May reveal sensitive system details (database status, connection counts, etc.).

**Required Fix**: Use `when-authorized` for production:
```
management.endpoint.health.show-details=when-authorized
management.endpoints.web.exposure.include=health
```

---

## 8. SECURITY ISSUES

### Issue 18: CRITICAL - System.err Prints JWT Errors
**Severity**: CRITICAL (combined with Issue 2)
**File**: JwtAuthenticationFilter
**Impact**: JWT validation errors may leak to logs/console without proper filtering

---

### Issue 19: HIGH - Password Field in Response DTO
**Severity**: HIGH (if present)
**Problem**: Need to verify that password is never returned in any response DTO

**Fix**: Ensure all response DTOs explicitly exclude password field and use @JsonIgnore if needed.

---

### Issue 20: MEDIUM - No Rate Limiting
**Severity**: MEDIUM
**Problem**: 
No rate limiting on authentication endpoints (registration, login, password reset).

**Impact**: Vulnerable to brute force and DoS attacks.

---

## 9. FILES THAT NEED MODIFICATION

```
CRITICAL (Must fix before production):
✓ src/main/java/com/example/authentication_module/Service/EmailSenderService.java
✓ src/main/java/com/example/authentication_module/Filter/JwtAuthenticationFilter.java
✓ src/main/java/com/example/authentication_module/controller/ProfileController.java
✓ src/main/java/com/example/authentication_module/Exception/GlobalExceptionHandler.java
✓ src/main/java/com/example/authentication_module/controller/UserController.java
✓ Dockerfile
✓ .gitignore (verify .env is ignored)

HIGH (Should fix):
✓ src/main/java/com/example/authentication_module/Service/RefreshTokenService.java
✓ src/main/java/com/example/authentication_module/Service/UserService.java
✓ pom.xml (add logging, consider CORS bean)
✓ application.properties

MEDIUM:
✓ Add .dockerignore
✓ Add proper CORS configuration

Create NEW:
✓ .dockerignore
✓ application-prod.properties (for production configuration)
✓ logback-spring.xml (for proper logging configuration)
```

---

## 10. RECOMMENDED FIXES (IMPLEMENTATION ORDER)

### Phase 1: Critical Fixes (DO NOT DEPLOY WITHOUT)
1. Fix hard-coded localhost URL in EmailSenderService password reset link
2. Replace System.err/out with proper SLF4J logging throughout
3. Fix JWT filter exception handling with proper logging framework
4. Replace generic RuntimeException with custom exceptions
5. Fix HTTP status codes (login should return 200, not 201)
6. Fix GlobalExceptionHandler parameter types and status codes
7. Add non-root user to Dockerfile
8. Create .dockerignore file
9. Change health check `show-details` to `when-authorized`
10. Reduce logging levels in properties to INFO

### Phase 2: High Priority Fixes (Before Production Push)
1. Add proper CORS configuration bean
2. Replace all System.println/err with logging
3. Add @Transactional to multi-step operations
4. Implement custom exceptions consistently
5. Create application-prod.properties
6. Add logback-spring.xml for logging configuration

### Phase 3: Medium Priority Improvements
1. Add request rate limiting (e.g., using Spring Cloud Circuit Breaker or Guava RateLimiter)
2. Add automatic cleanup of expired tokens (scheduled job)
3. Add comprehensive test suite
4. Document all endpoints and security requirements

---

## 11. DEPLOYMENT CHECKLIST (UPDATED)

- [ ] Audit complete and all findings reviewed
- [ ] CRITICAL issues fixed and code reviewed
- [ ] HIGH priority issues resolved
- [ ] Maven tests pass: `mvn clean test`
- [ ] Maven build passes: `mvn clean package -DskipTests`
- [ ] JAR file exists and named correctly: `authentication_module-0.0.1-SNAPSHOT.jar`
- [ ] Dockerfile builds successfully
- [ ] Image runs locally with correct environment variables
- [ ] No secrets in logs when running container
- [ ] Health check endpoint responds with 200 OK
- [ ] API endpoints tested with sample requests
- [ ] No build warnings or errors
- [ ] Security scan (Trivy) shows no CRITICAL vulnerabilities
- [ ] Non-root user runs in container
- [ ] Environment variables properly configured (no hard-coded values)
- [ ] .env file excluded from Git (.gitignore)
- [ ] .dockerignore file exists and appropriate
- [ ] Ready for ECR push

---

## NEXT STEPS

1. ✅ Review this audit report
2. ⏭️ Implement all CRITICAL fixes
3. ⏭️ Implement HIGH priority fixes
4. ⏭️ Run `mvn clean test`
5. ⏭️ Run `mvn clean package -DskipTests`
6. ⏭️ Build Docker image locally
7. ⏭️ Test container with environment variables
8. ⏭️ Run security scan with Trivy
9. ⏭️ Push to AWS ECR
10. ⏭️ Deploy to EC2

---

**Generated**: 2026-09-25T12:47:53Z
**Status**: NEEDS FIXES BEFORE DEPLOYMENT
