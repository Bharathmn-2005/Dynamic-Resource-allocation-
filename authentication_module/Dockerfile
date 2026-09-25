# Build stage
FROM maven:3.9.4-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml
COPY authentication_module/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY authentication_module/src/ src/

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

# Copy the built jar from builder stage
COPY --from=builder /app/target/authentication_module-0.0.1-SNAPSHOT.jar app.jar

# Set ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Set environment variables
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=50s --retries=3 \
    CMD curl -fsS http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]

