# Train Ticket Reservation System

A comprehensive, production-ready microservices-based train ticket reservation platform built with Spring Boot, React, and modern DevOps practices.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start with Docker](#quick-start-with-docker)
- [Development Setup](#development-setup)
- [API Endpoints Reference](#api-endpoints-reference)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)
- [Security Considerations](#security-considerations)

## 🎯 Project Overview

The Train Ticket Reservation System is a full-stack application that allows users to:
- Register and authenticate
- Search and browse available trains
- Book train tickets
- Process payments securely
- Receive email notifications
- Track booking history

The system is built as a microservices architecture with independent services for authentication, booking, payment processing, and notifications.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                      │
│                     Port: 5173 (http://localhost:5173)              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
        ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
        │  Auth Service    │  │ Booking Svc  │  │Payment Svc   │
        │  Port: 8080      │  │  Port: 8082  │  │ Port: 8083   │
        └──────────────────┘  └──────────────┘  └──────────────┘
                 │                    │               │
                 └────────────────────┼───────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ PostgreSQL   │  │ Redis Cache  │  │Notification  │
            │  Port: 5432  │  │ Port: 6379   │  │Port: 8081    │
            └──────────────┘  └──────────────┘  └──────────────┘
```

### Service Architecture

**Microservices**:
1. **Authentication Service** (Port 8080)
   - User registration, login, email verification
   - JWT token generation and validation
   - Password reset functionality
   - SMTP email integration

2. **Booking Service** (Port 8082)
   - Train search and availability management
   - Ticket booking and cancellation
   - Booking history and status tracking
   - Redis caching for frequently accessed data

3. **Payment Service** (Port 8083)
   - Payment processing (Sandbox and Razorpay integration)
   - Transaction history and verification
   - Payment status updates to booking service

4. **Notification Service** (Port 8081)
   - Email notification dispatch
   - Booking confirmation emails
   - Ticket reminders
   - Payment receipts

## 🛠️ Tech Stack

### Backend
- **Java 21** - Programming language
- **Spring Boot 4.1.0** - Microservices framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - ORM and database access
- **PostgreSQL 16** - Primary database
- **Redis 7** - Session storage and caching
- **JWT (JJWT)** - Token-based authentication
- **Maven** - Build tool
- **Lombok** - Code generation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Container orchestration (development)
- **Kubernetes-ready** - Health checks and resource limits

### Development Tools
- **Git** - Version control
- **Postman** - API testing (collection included)
- **Maven** - Dependency management

## 🚀 Quick Start with Docker

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Train_ticket
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env and configure your SMTP credentials
   ```

3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Create PostgreSQL database with all service databases
   - Start Redis cache
   - Build and start all 4 microservices
   - Build and start React frontend

4. **Wait for services to be healthy**
   ```bash
   docker-compose ps
   # All services should show "healthy" status
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - API Documentation:
     - Auth: http://localhost:8080/swagger-ui.html
     - Booking: http://localhost:8082/swagger-ui.html
     - Payment: http://localhost:8083/swagger-ui.html
     - Notification: http://localhost:8081/swagger-ui.html

### Stopping Services
```bash
docker-compose down        # Stop all services, keep volumes
docker-compose down -v     # Stop all services, remove volumes
```

## 💻 Development Setup

### Prerequisites
- Java 21 JDK
- Maven 3.8+
- Node.js 18+
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

### Backend Setup

1. **Start PostgreSQL and Redis** (using Docker)
   ```bash
   docker-compose up -d postgres redis
   ```

2. **Build all services**
   ```bash
   # Auth Service
   cd authentication_module/authentication_module
   mvn clean package -DskipTests
   
   # Booking Service
   cd booking_service/booking_service
   mvn clean package -DskipTests
   
   # Payment Service
   cd payment_service
   mvn clean package -DskipTests
   
   # Notification Service
   cd notification_service
   mvn clean package -DskipTests
   ```

3. **Run services**
   
   Each service can be run independently:
   ```bash
   # Terminal 1 - Auth Service
   cd authentication_module/authentication_module
   mvn spring-boot:run
   
   # Terminal 2 - Booking Service
   cd booking_service/booking_service
   mvn spring-boot:run
   
   # Terminal 3 - Payment Service
   cd payment_service
   mvn spring-boot:run
   
   # Terminal 4 - Notification Service
   cd notification_service
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Endpoints Reference

### Authentication Service (Port 8080)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/verify-email` | Verify email with token | No |
| POST | `/auth/refresh-token` | Refresh JWT token | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| GET | `/auth/profile` | Get current user profile | Yes |

### Booking Service (Port 8082)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/trains` | List all trains | No |
| GET | `/api/trains/search` | Search trains by route/date | No |
| GET | `/api/trains/{id}` | Get train details | No |
| GET | `/api/trains/{id}/availability` | Get seat availability | No |
| POST | `/api/bookings` | Create new booking | Yes |
| GET | `/api/bookings/{id}` | Get booking details | Yes |
| GET | `/api/bookings` | List user bookings | Yes |
| PUT | `/api/bookings/{id}/cancel` | Cancel booking | Yes |

### Payment Service (Port 8083)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/payments/initiate` | Initiate payment | Yes |
| POST | `/api/payments/razorpay/callback` | Razorpay webhook callback | No |
| GET | `/api/payments/{id}` | Get payment details | Yes |
| GET | `/api/payments/booking/{bookingId}` | Get payment for booking | Yes |

### Notification Service (Port 8081)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/notifications` | Send notification | No (internal) |
| GET | `/api/notifications/{id}` | Get notification | No |
| GET | `/api/notifications` | List notifications | No |

## 🗄️ Database Schema

### Shared Databases

The system uses 4 independent PostgreSQL databases:

1. **auth_service** - User credentials, profiles, verification tokens
2. **booking_service** - Trains, bookings, schedules, seats
3. **payment_service** - Payment transactions, receipts, status
4. **notification_service** - Email logs, notification history

### Key Tables

**auth_service.users**
- id (UUID)
- email (VARCHAR)
- password (VARCHAR)
- first_name, last_name (VARCHAR)
- email_verified (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

**booking_service.trains**
- id (UUID)
- name, number (VARCHAR)
- source, destination (VARCHAR)
- departure, arrival (TIMESTAMP)
- total_seats (INTEGER)
- created_at, updated_at (TIMESTAMP)

**booking_service.bookings**
- id (UUID)
- user_id (UUID)
- train_id (UUID)
- seat_numbers (VARCHAR)
- status (ENUM)
- created_at, updated_at (TIMESTAMP)

**payment_service.payments**
- id (UUID)
- booking_id (UUID)
- amount (DECIMAL)
- currency (VARCHAR)
- status (ENUM)
- payment_method (VARCHAR)
- created_at, updated_at (TIMESTAMP)

**notification_service.notifications**
- id (UUID)
- recipient_email (VARCHAR)
- type (ENUM)
- status (ENUM)
- created_at, updated_at (TIMESTAMP)

## 🔐 Environment Variables

See `.env.example` for all available environment variables. Key variables:

### Database Configuration
```
AUTH_DB_URL=jdbc:postgresql://localhost:5432/auth_service
AUTH_DB_USERNAME=postgres
AUTH_DB_PASSWORD=your_password

BOOKING_DB_URL=jdbc:postgresql://localhost:5432/booking_service
BOOKING_DB_USERNAME=postgres
BOOKING_DB_PASSWORD=your_password

PAYMENT_DB_URL=jdbc:postgresql://localhost:5432/payment_service
PAYMENT_DB_USERNAME=postgres
PAYMENT_DB_PASSWORD=your_password

NOTIFICATION_DB_URL=jdbc:postgresql://localhost:5432/notification_service
NOTIFICATION_DB_USERNAME=postgres
NOTIFICATION_DB_PASSWORD=your_password
```

### Email Configuration (SMTP)
```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Payment Gateway
```
PAYMENT_PROVIDER=SANDBOX  # or RAZORPAY
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Security
```
JWT_SECRET=your-min-32-char-secret-key
JWT_EXPIRATION=86400000  # 24 hours in milliseconds
```

## 🔧 Troubleshooting

### Services won't start

1. **Check Docker and Docker Compose installation**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Check port availability**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Linux/Mac
   lsof -i :8080
   ```

3. **View logs**
   ```bash
   docker-compose logs -f auth-service    # View specific service logs
   docker-compose logs                    # View all logs
   ```

### Database connection errors

1. **Verify PostgreSQL is running**
   ```bash
   docker-compose ps postgres
   ```

2. **Check database initialization**
   ```bash
   docker exec train-ticket-postgres psql -U postgres -c "\l"
   ```

3. **Verify credentials in .env**
   ```bash
   cat .env | grep DB_
   ```

### SMTP/Email issues

1. **Enable "Less secure app access"** for Gmail or **generate App Password**
   - Gmail: https://myaccount.google.com/apppasswords
   - Other providers: Check your email provider's documentation

2. **Test connection**
   ```bash
   docker-compose logs -f notification-service
   ```

### Frontend can't connect to backend

1. **Check API base URL** in frontend `.env`
2. **Check CORS configuration** in backend
3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

## 🚀 Production Deployment

### Using docker-compose-prod.yml

```bash
# Build production images
docker-compose -f docker-compose-prod.yml build

# Start production services
docker-compose -f docker-compose-prod.yml up -d

# Monitor services
docker-compose -f docker-compose-prod.yml ps
docker-compose -f docker-compose-prod.yml logs -f
```

### Production Considerations

1. **Use strong JWT secrets** (minimum 32 characters)
2. **Enable HTTPS/TLS** in reverse proxy (Nginx/HAProxy)
3. **Set up proper backups** for PostgreSQL data
4. **Configure logging** to external service (ELK stack, Datadog, etc.)
5. **Set resource limits** for containers
6. **Use environment-specific .env** files
7. **Enable health checks** and monitoring
8. **Set up auto-restart** policies

### Kubernetes Deployment

The system is designed to be Kubernetes-ready:
- Health check endpoints at `/actuator/health`
- Stateless services (can scale horizontally)
- Resource limits defined in compose files
- Environment variable configuration
- Use k8s manifests for production deployment

## 🔒 Security Considerations

1. **Credentials Management**
   - All sensitive data in environment variables
   - `.env` file excluded from version control
   - `.env.example` committed for reference

2. **Authentication**
   - JWT-based stateless authentication
   - Passwords hashed with bcrypt
   - Email verification for registration
   - Secure password reset flow

3. **API Security**
   - CORS configured for frontend origin
   - Rate limiting on sensitive endpoints
   - CSRF protection enabled
   - Input validation on all endpoints

4. **Database Security**
   - Encryption at rest (configure in production)
   - Connection pooling with Hikari
   - SQL injection prevention via JPA
   - Audit logging enabled

5. **Transport Security**
   - HTTPS/TLS in production
   - Secure cookies (HTTPOnly, Secure flags)
   - API keys never logged

## 📞 Support

For issues, questions, or contributions:
1. Check the Troubleshooting section
2. Review logs: `docker-compose logs -f`
3. Open an issue on GitHub
4. Submit a pull request with fixes

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Last Updated**: September 2026
**Version**: 1.0.0
