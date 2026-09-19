# 🚂 Train Ticket Booking System

A full-stack microservices-based train ticket reservation platform with authentication, booking, payment, and notification services.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Services Overview](#services-overview)
- [API Endpoints](#api-endpoints)
- [Development Setup](#development-setup)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│                      Port 5173 (Vite Dev)                   │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
    ┌──────▼──┐    ┌──────▼──┐   ┌──────▼──┐
    │  Auth   │    │ Booking │   │ Payment │
    │ Service │    │ Service │   │ Service │
    │8080     │    │8082     │   │8083     │
    └──────┬──┘    └────┬────┘   └────┬────┘
           │             │             │
           │        ┌────▼─────────────┘
           │        │
           │    ┌───▼──────────────┐
           │    │ Notification    │
           │    │ Service (8081)  │
           │    └────────────────┘
           │
    ┌──────▼──────────┐
    │   PostgreSQL    │
    │ (Port 5432)     │
    │ 4 Databases     │
    └─────────────────┘
           ▲
    ┌──────┴──────────┐
    │    Redis       │
    │  (Port 6379)   │
    └────────────────┘
```

## 💻 Tech Stack

### Backend Services
- **Framework**: Spring Boot 4.1.0 (3.2.0 for Notification)
- **Language**: Java 21
- **Build Tool**: Maven 3.9.4
- **Database**: PostgreSQL 16
- **Cache/Session**: Redis 7
- **Security**: Spring Security + JWT (JJWT 0.12.6)

### Frontend
- **Framework**: React 19.2.8
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.3.6
- **Styling**: TailwindCSS 4.3.3
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router 7.18.2

### DevOps
- **Containerization**: Docker (Multi-stage builds)
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (optional)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (v2.0+)
- Git
- (Optional) Java 21 & Maven 3.9.4 for local development

### Using Docker Compose

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd Train_ticket
   cp .env.example .env
   ```

2. **Configure Environment** (optional)
   ```bash
   # Edit .env file with your settings
   # Default: SANDBOX payment provider, local mailhog/gmail
   ```

3. **Start All Services**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services**
   ```bash
   # Wait ~30 seconds for services to start
   curl http://localhost:8080/actuator/health    # Auth
   curl http://localhost:8082/actuator/health    # Booking
   curl http://localhost:8083/actuator/health    # Payment
   curl http://localhost:8081/actuator/health    # Notification
   curl http://localhost:5173                    # Frontend
   ```

5. **Access Application**
   - **Frontend**: http://localhost:5173
   - **Auth API**: http://localhost:8080
   - **Booking API**: http://localhost:8082
   - **Payment API**: http://localhost:8083
   - **Notification API**: http://localhost:8081

### Stop All Services
```bash
docker-compose down
docker-compose down -v  # Also remove volumes (database data)
```

## 📁 Project Structure

```
Train_ticket/
├── authentication_module/
│   ├── authentication_module/
│   │   ├── src/
│   │   │   ├── main/java/com/example/authentication_module/
│   │   │   │   ├── controller/          # REST endpoints
│   │   │   │   ├── service/             # Business logic
│   │   │   │   ├── repository/          # Data access
│   │   │   │   ├── model/               # JPA entities
│   │   │   │   ├── dto/                 # Request/Response DTOs
│   │   │   │   ├── security/            # JWT & Spring Security
│   │   │   │   ├── exception/           # Custom exceptions
│   │   │   │   └── config/              # Configuration classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── pom.xml
│   ├── Dockerfile
│   └── target/                          # Built JAR files
│
├── booking_service/
│   ├── booking_service/
│   │   ├── src/
│   │   │   ├── main/java/com/example/booking_service/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   ├── dto/
│   │   │   │   ├── security/
│   │   │   │   ├── exception/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── railway-data.csv     # Train data seed
│   │   └── pom.xml
│   ├── Dockerfile
│   └── target/
│
├── payment_service/
│   ├── src/
│   │   ├── main/java/com/example/payment_service/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── gateway/                 # Payment provider abstractions
│   │   │   │   ├── PaymentGateway
│   │   │   │   ├── SandboxPaymentGateway
│   │   │   │   └── RazorpayPaymentGateway
│   │   │   ├── model/
│   │   │   ├── dto/
│   │   │   ├── client/                  # HTTP clients for other services
│   │   │   ├── exception/
│   │   │   └── config/
│   │   └── resources/
│   │       └── application.properties
│   ├── Dockerfile
│   ├── pom.xml
│   └── target/
│
├── notification_service/
│   ├── src/
│   │   ├── main/java/com/ticketbooking/notificationservice/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── email/                   # Email service
│   │   │   ├── scheduler/               # Task scheduling
│   │   │   ├── exception/
│   │   │   └── config/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── bootstrap.yml
│   ├── Dockerfile
│   ├── pom.xml
│   └── target/
│
├── frontend/
│   ├── src/
│   │   ├── pages/                       # Page components
│   │   ├── components/                  # Reusable components
│   │   ├── features/                    # Feature modules (auth, trains, ui)
│   │   ├── api/                         # API integration
│   │   ├── types/                       # TypeScript types
│   │   ├── utils/                       # Utility functions
│   │   ├── styles/                      # Global styles
│   │   ├── App.tsx                      # Root component
│   │   └── main.tsx                     # Entry point
│   ├── public/                          # Static assets
│   ├── Dockerfile                       # Frontend build container
│   ├── vite.config.ts                   # Vite configuration
│   ├── tsconfig.json                    # TypeScript config
│   ├── tailwind.config.ts               # TailwindCSS config
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml                   # Local dev orchestration
├── docker-compose.prod.yml              # Production settings
├── init-db.sql                          # Database initialization
├── .env.example                         # Environment template
├── .gitignore
└── README.md                            # This file
```

## 🔧 Services Overview

### 1. Authentication Service (Port 8080)
**Purpose**: User authentication, JWT token management, email verification

**Key Endpoints**:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with credentials
- `POST /auth/verify-email` - Verify email token
- `POST /auth/refresh-token` - Get new JWT token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password

**Database**: `postgres` (4 tables: users, roles, refresh_tokens, email_verification)

---

### 2. Booking Service (Port 8082)
**Purpose**: Train search, availability, and booking management

**Key Endpoints**:
- `GET /api/trains/search` - Search trains by route/date
- `GET /api/trains/{trainId}/seats` - Get seat availability
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/my-bookings` - Get user's bookings
- `GET /api/booking/{bookingId}` - Get booking details
- `PUT /api/booking/{bookingId}/cancel` - Cancel booking

**Database**: `booking_service` (tables: trains, stations, schedules, bookings, passengers)

**Features**:
- Train data seeding from CSV
- Automatic booking number (PNR) generation
- Seat availability calculation
- Redis caching for performance

---

### 3. Payment Service (Port 8083)
**Purpose**: Payment processing and gateway integration

**Key Endpoints**:
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/{paymentId}` - Get payment status
- `POST /api/payments/webhook` - Handle payment gateway webhooks
- `GET /api/payments/booking/{bookingId}` - Get payments for booking

**Database**: `payment_service` (tables: payments)

**Features**:
- SANDBOX mode for local testing
- Razorpay integration (configurable)
- Webhook validation & processing
- Payment status tracking

---

### 4. Notification Service (Port 8081)
**Purpose**: Email notifications and reminders

**Key Endpoints**:
- `POST /api/notification/send` - Send notification
- `GET /api/notification/{id}` - Get notification
- `GET /api/notification/booking/{bookingId}` - Get booking notifications

**Database**: `notification_db` (tables: notifications)

**Features**:
- Email notifications for bookings
- Ticket reminder scheduler
- Configurable SMTP
- Retry mechanism for failed emails

---

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/verify-email` | Email verification |
| POST | `/auth/refresh-token` | Refresh JWT |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/profile` | Get profile |
| PUT | `/profile` | Update profile |
| POST | `/change-password` | Change password |

### Booking Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/trains/search` | Search trains |
| GET | `/api/trains/{id}/seats` | Check availability |
| POST | `/api/booking/create` | Create booking |
| GET | `/api/booking/my-bookings` | List bookings |
| GET | `/api/booking/{id}` | Booking details |
| DELETE | `/api/booking/{id}/cancel` | Cancel booking |

### Payment Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/payments/initiate` | Start payment |
| GET | `/api/payments/{id}` | Payment status |
| POST | `/api/payments/webhook` | Webhook handler |

### Notification Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/notification/send` | Send email |
| GET | `/api/notification/{id}` | Get notification |

---

## 💾 Database Schema

### Authentication Database (postgres)
```
users
├── id (UUID)
├── username (VARCHAR)
├── email (VARCHAR)
├── password (VARCHAR - bcrypt)
├── full_name (VARCHAR)
├── phone (VARCHAR)
├── date_of_birth (DATE)
├── is_active (BOOLEAN)
├── email_verified (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

refresh_tokens
├── id (UUID)
├── user_id (FK)
├── token (TEXT)
├── expires_at (TIMESTAMP)
└── created_at (TIMESTAMP)
```

### Booking Database (booking_service)
```
trains
├── id (UUID)
├── train_name (VARCHAR)
├── train_number (VARCHAR)
├── source_station (FK)
├── destination_station (FK)
├── total_seats (INTEGER)
├── available_seats (INTEGER)
└── train_type (ENUM)

bookings
├── id (UUID)
├── user_id (FK)
├── train_id (FK)
├── pnr (VARCHAR - unique)
├── booking_date (DATE)
├── journey_date (DATE)
├── passenger_count (INTEGER)
├── total_fare (DECIMAL)
├── booking_status (ENUM)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

passengers
├── id (UUID)
├── booking_id (FK)
├── name (VARCHAR)
├── age (INTEGER)
├── gender (ENUM)
└── seat_number (VARCHAR)
```

### Payment Database (payment_service)
```
payments
├── id (UUID)
├── booking_id (FK)
├── amount (DECIMAL)
├── currency (VARCHAR)
├── payment_status (ENUM)
├── payment_provider (VARCHAR)
├── transaction_id (VARCHAR)
├── payment_method (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Notification Database (notification_db)
```
notifications
├── id (UUID)
├── booking_id (FK)
├── user_email (VARCHAR)
├── notification_type (ENUM)
├── subject (VARCHAR)
├── message (TEXT)
├── status (ENUM - SENT/FAILED/PENDING)
├── retry_count (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🛠️ Development Setup

### Local Setup (without Docker)

1. **Prerequisites**
   ```bash
   # Java 21
   java -version
   
   # Maven 3.9.4
   mvn -version
   
   # PostgreSQL 16
   psql --version
   
   # Redis 7
   redis-cli --version
   ```

2. **Start PostgreSQL & Redis**
   ```bash
   # Windows (using WSL or Docker)
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine
   docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Configure Services**
   - Edit `application.properties` in each service
   - Set database URLs, email credentials, etc.

4. **Build Services**
   ```bash
   # Authentication
   cd authentication_module/authentication_module
   mvn clean package
   
   # Booking
   cd booking_service/booking_service
   mvn clean package
   
   # Payment
   cd payment_service
   mvn clean package
   
   # Notification
   cd notification_service
   mvn clean package
   ```

5. **Start Services**
   ```bash
   # In separate terminals
   java -jar authentication_module/authentication_module/target/authentication_module-0.0.1-SNAPSHOT.jar
   java -jar booking_service/booking_service/target/booking_service-0.0.1-SNAPSHOT.jar
   java -jar payment_service/target/payment_service-0.0.1-SNAPSHOT.jar
   java -jar notification_service/target/notification-service-1.0.0.jar
   ```

6. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🚢 Deployment

### Docker Build

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build auth-service

# Push to registry (optional)
docker tag train-ticket:latest myregistry/train-ticket:latest
docker push myregistry/train-ticket:latest
```

### Production Deployment

See `docker-compose.prod.yml` for production-ready configuration with:
- Resource limits
- Health checks
- Restart policies
- Logging drivers
- Network security

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check if ports are already in use
netstat -tuln | grep LISTEN

# View logs
docker-compose logs auth-service
docker-compose logs booking-service

# Rebuild without cache
docker-compose build --no-cache
```

### Database Connection Issues
```bash
# Verify PostgreSQL is running
docker exec train_ticket_postgres pg_isready

# Check database exists
docker exec train_ticket_postgres psql -U postgres -l

# Reset database
docker-compose down -v
docker-compose up postgres
```

### Email Not Sending
- Verify MAIL_USERNAME and MAIL_PASSWORD in .env
- For Gmail: Use app-specific password, not account password
- Check SMTP settings in service configuration

### Payment Gateway Issues
- Default is SANDBOX mode (safe for testing)
- For Razorpay: Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- Test webhooks with: `http://localhost:8083/api/payments/webhook`

### Frontend Can't Connect to Backend
- Verify proxy configuration in `vite.config.ts`
- Check CORS settings in Spring Security
- Ensure backend services are healthy: `curl http://localhost:8080/actuator/health`

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Docker Documentation](https://docs.docker.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Documentation](https://tools.ietf.org/html/rfc7519)

---

## 📄 License

[Add your license here]

## 👥 Contributors

- Developed by: Bharath M N
- GitHub: [Bharathmn2005/Train_ticket](https://github.com/Bharathmn2005/Train_ticket)

---

**Last Updated**: September 2026
**Version**: 1.0.0
