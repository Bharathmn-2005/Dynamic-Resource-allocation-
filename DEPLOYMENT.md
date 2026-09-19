# 🚀 Deployment Guide

This guide covers deploying the Train Ticket Booking System to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Service Deployment](#service-deployment)
- [SSL/TLS Configuration](#ssltls-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Server Requirements

- **OS**: Ubuntu 22.04 LTS or equivalent
- **CPU**: 4 cores minimum (8 recommended for production)
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 50GB SSD (for logs, databases)
- **Docker**: v20.10+
- **Docker Compose**: v2.0+

### SSL Certificates

- Domain name
- SSL certificate (from Let's Encrypt or CA)
- Private key file

### Third-party Services

- **Email Service**: Gmail, SendGrid, or equivalent
- **Payment Gateway**: Razorpay or similar (for production)
- **Monitoring**: Optional (Datadog, New Relic, etc.)

## Environment Configuration

### 1. Create Production .env File

```bash
# Server
SERVER_HOST=your-domain.com
SERVER_PORT=443

# Database
DB_HOST=your-db-server.com
DB_PORT=5432
DB_PASSWORD=strong-random-password-here

# Mail Configuration
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key

# Frontend
FRONTEND_BASE_URL=https://your-domain.com

# Payment Gateway (Razorpay)
PAYMENT_PROVIDER=RAZORPAY
PAYMENT_CURRENCY=INR
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Application
TIMEZONE=Asia/Kolkata
JAVA_OPTS="-Xmx2g -Xms1g"

# Security
JWT_SECRET=your-secret-jwt-key
APP_ENV=production
```

### 2. Secure Environment Variables

```bash
# Create secure file with limited permissions
sudo touch /etc/train-ticket/.env
sudo chmod 600 /etc/train-ticket/.env

# Edit with sensitive values
sudo nano /etc/train-ticket/.env

# Load during deployment
export $(cat /etc/train-ticket/.env | xargs)
```

## Database Setup

### 1. PostgreSQL on Managed Service

For production, use a managed PostgreSQL service (AWS RDS, Azure Database, etc.)

```bash
# Create databases
psql -h your-db-host -U postgres -c "CREATE DATABASE postgres;"
psql -h your-db-host -U postgres -c "CREATE DATABASE booking_service;"
psql -h your-db-host -U postgres -c "CREATE DATABASE payment_service;"
psql -h your-db-host -U postgres -c "CREATE DATABASE notification_db;"

# Create application user
psql -h your-db-host -U postgres -c "CREATE USER app_user WITH PASSWORD 'app_password';"

# Grant privileges
psql -h your-db-host -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE postgres TO app_user;"
psql -h your-db-host -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE booking_service TO app_user;"
psql -h your-db-host -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE payment_service TO app_user;"
psql -h your-db-host -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE notification_db TO app_user;"
```

### 2. Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgresql"

for db in postgres booking_service payment_service notification_db; do
    pg_dump -h $DB_HOST -U $DB_USER $db | gzip > $BACKUP_DIR/${db}_${DATE}.sql.gz
done

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

# Schedule with cron
0 2 * * * /scripts/backup-db.sh
```

## Service Deployment

### 1. Using Docker Compose (Recommended for Small to Medium)

```bash
# Clone repository
git clone <your-repo>
cd Train_ticket

# Copy production config
cp .env.example .env
# Edit .env with production values
nano .env

# Create volumes for persistence
mkdir -p /data/postgres
mkdir -p /data/redis
mkdir -p /logs

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker-compose ps
docker-compose logs --tail=50
```

### 2. Using Kubernetes (For High Availability)

```yaml
# deployment.yaml example
apiVersion: v1
kind: ConfigMap
metadata:
  name: train-ticket-config
data:
  DB_HOST: postgres-service
  DB_PORT: "5432"
  TIMEZONE: "Asia/Kolkata"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: your-registry/auth-service:latest
        ports:
        - containerPort: 8080
        envFrom:
        - configMapRef:
            name: train-ticket-config
        env:
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-password
              key: password
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 40
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 10
```

## SSL/TLS Configuration

### 1. Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
# Certbot auto-renews via systemd timer
```

### 2. Nginx Reverse Proxy with SSL

```nginx
# /etc/nginx/sites-available/train-ticket
upstream auth_backend {
    server auth-service:8080;
}

upstream booking_backend {
    server booking-service:8082;
}

upstream payment_backend {
    server payment-service:8083;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location /api/auth/ {
        proxy_pass http://auth_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/booking/ {
        proxy_pass http://booking_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location /api/payment/ {
        proxy_pass http://payment_backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location / {
        proxy_pass http://frontend:5173/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### 3. Enable Nginx Config

```bash
sudo ln -s /etc/nginx/sites-available/train-ticket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Monitoring & Logging

### 1. Structured Logging with ELK Stack

Update `application.yml` for JSON logging:

```yaml
logging:
  level:
    root: INFO
  pattern:
    json: '{"timestamp":"%d{yyyy-MM-dd HH:mm:ss}","level":"%level","logger":"%logger{36}","message":"%msg"}'
```

### 2. Application Performance Monitoring

```yaml
# Add Micrometer metrics
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

Access metrics: `http://your-domain:8080/actuator/prometheus`

### 3. Health Checks

```bash
# Monitor health endpoints
while true; do
    curl -s http://localhost:8080/actuator/health | jq .
    sleep 30
done
```

## Backup & Recovery

### 1. Database Backup Strategy

- **Daily** backups: Automated via cron
- **Retention**: 30 days rolling window
- **Location**: Separate secure storage (AWS S3, Azure Blob)

### 2. Application Backup

```bash
# Backup configuration and credentials
tar -czf /backups/config_$(date +%Y%m%d).tar.gz /etc/train-ticket/

# Backup Docker volumes
docker run --rm -v train_ticket_postgres_data:/data \
  -v /backups:/backup \
  alpine tar czf /backup/postgres_$(date +%Y%m%d).tar.gz -C /data .
```

### 3. Recovery Procedure

```bash
# 1. Restore database
psql -h $DB_HOST -U $DB_USER < /backups/postgres_YYYYMMDD.sql.gz

# 2. Restart services
docker-compose down
docker-compose up -d

# 3. Verify
docker-compose ps
curl http://localhost:8080/actuator/health
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs --tail=100 auth-service

# Common issues:
# - Database not ready: wait and retry
# - Port already in use: change port in docker-compose.yml
# - Memory issues: increase JAVA_OPTS
```

### Database Connection Issues

```bash
# Test connection
docker exec train_ticket_postgres psql -U postgres -c "SELECT 1"

# Check connection string
echo $DATABASE_URL

# Verify network
docker network inspect train_ticket_network
```

### Memory/CPU Issues

```bash
# Check resource usage
docker stats

# Increase limits in docker-compose.yml
services:
  auth-service:
    mem_limit: 2g
    cpus: '1.5'
```

---

**Last Updated**: September 2026
