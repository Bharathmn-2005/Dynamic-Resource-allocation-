# 🚀 Quick Start Guide - Train Ticket Booking System

**Project Status**: ✅ **COMPLETE** - Ready for deployment!

---

## 30-Second Setup

```bash
# 1. Navigate to project
cd Train_ticket

# 2. Start all services
docker-compose up -d

# 3. Wait ~30 seconds for startup
# 4. Access at http://localhost:5173
```

✅ That's it! All services running.

---

## ⚡ One-Minute Overview

### What You Have

- **4 Backend Microservices** (Spring Boot + Java 21)
  - Auth (8080): User login/registration
  - Booking (8082): Train search & booking
  - Payment (8083): Payment processing
  - Notification (8081): Email notifications

- **React Frontend** (5173): Modern UI with TailwindCSS

- **Databases**
  - PostgreSQL 16: All data
  - Redis 7: Caching

- **Production-Ready**
  - Docker containers for all services
  - Comprehensive documentation
  - Security guidelines
  - CI/CD pipeline
  - Health checks

---

## 🎯 Quick Commands

### Start System
```bash
docker-compose up -d
```

### Check Status
```bash
# Linux/Mac
./scripts/health-check.sh

# Windows
./scripts/health-check.bat
```

### View Logs
```bash
docker-compose logs -f auth-service
docker-compose logs -f booking-service
docker-compose logs -f payment-service
docker-compose logs -f notification-service
docker-compose logs -f frontend
```

### Stop System
```bash
docker-compose down        # Stop all services
docker-compose down -v     # Stop + delete data
```

### Rebuild Services
```bash
docker-compose build              # Build all
docker-compose build auth-service # Build specific
```

---

## 📍 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5173 | 5173 |
| Auth API | http://localhost:8080 | 8080 |
| Booking API | http://localhost:8082 | 8082 |
| Payment API | http://localhost:8083 | 8083 |
| Notification API | http://localhost:8081 | 8081 |
| PostgreSQL | localhost | 5432 |
| Redis | localhost | 6379 |

---

## 🧪 Test the System

### 1. User Registration
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123456",
    "full_name": "Test User"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456"
  }'
```

### 3. Search Trains
```bash
curl "http://localhost:8082/api/trains/search?from=NEW%20DELHI&to=MUMBAI&date=2024-12-25"
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env` file:
```bash
cp .env.example .env
nano .env
```

**Key Variables**:
```bash
# Database
DB_PASSWORD=postgres

# Email (Gmail or SendGrid)
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Frontend
FRONTEND_BASE_URL=http://localhost:5173

# Payment (Razorpay)
PAYMENT_PROVIDER=SANDBOX  # Use SANDBOX for testing
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## 📊 Database Access

### PostgreSQL
```bash
# Connect to database
docker exec -it train_ticket_postgres psql -U postgres

# View databases
\l

# Switch to booking_service DB
\c booking_service

# View tables
\dt

# View specific table
SELECT * FROM trains;
```

### Redis
```bash
# Connect to Redis
docker exec -it train_ticket_redis redis-cli

# Check keys
KEYS *

# View specific key
GET <key>
```

---

## 🐛 Troubleshooting

### Services Won't Start?
```bash
# Check what's running
docker-compose ps

# Check logs
docker-compose logs

# Restart
docker-compose restart
```

### Can't Connect to Database?
```bash
# Test connection
docker exec train_ticket_postgres psql -U postgres -c "SELECT 1"

# Check port
netstat -tuln | grep 5432
```

### Memory Issues?
```bash
# Check usage
docker stats

# Increase limits in docker-compose.yml
services:
  auth-service:
    mem_limit: 1g
```

### Port Already in Use?
```bash
# Find what's using port 8080
lsof -i :8080

# Or change port in docker-compose.yml
ports:
  - "8081:8080"  # Use 8081 instead
```

---

## 📚 Documentation

For detailed information:

- **README_FULL.md** - Complete system documentation
- **DEPLOYMENT.md** - Production deployment guide
- **SECURITY.md** - Security implementation
- **API_DOCS.json** - API specification
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🎓 System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React + Vite)                │
│              http://localhost:5173                  │
└─────────────┬─────────────────────────────┬─────────┘
              │                             │
      ┌───────▼──────┐            ┌────────▼────────┐
      │ Auth Service │            │ Booking Service │
      │ :8080        │            │ :8082           │
      └───────┬──────┘            └─────┬───────────┘
              │                         │
         ┌────▼─────────────────────────┘
         │
    ┌────▼──────┐         ┌──────────┐
    │ Payment   │        │Notification│
    │ Service   │        │ Service    │
    │ :8083     │        │ :8081      │
    └───┬───────┘        └──┬────────┘
        └────────┬──────────┘
                 │
      ┌──────────▼──────────────┐
      │   PostgreSQL (5 DBs)   │
      │   Redis Cache (:6379)   │
      └────────────────────────┘
```

---

## ✨ Features

### Authentication Service ✅
- User registration with email verification
- JWT-based authentication
- Password reset & change
- User profile management
- Token refresh mechanism

### Booking Service ✅
- Train search by route/date/class
- Seat availability checking
- Booking creation with PNR generation
- Passenger management
- Booking cancellation

### Payment Service ✅
- Payment gateway integration (Razorpay + Sandbox)
- Payment status tracking
- Webhook handling
- Transaction history

### Notification Service ✅
- Email notifications
- Booking confirmations
- Ticket reminders
- Automatic scheduling
- Retry logic

### Frontend ✅
- Modern React UI
- TypeScript for type safety
- Form validation
- Error handling
- Responsive design (TailwindCSS)
- User authentication flow
- Train search & filtering
- Booking management
- Payment integration

---

## 🚀 Next Steps

### For Development
1. ✅ All services running
2. Make code changes
3. Services auto-reload (hot reload available)
4. Test changes
5. Commit to git

### For Production
1. Configure `.env` with production values
2. Use `docker-compose.prod.yml`
3. Set up SSL/TLS certificates
4. Configure monitoring
5. Set up backups
6. Deploy to cloud (AWS, Azure, GCP, etc.)

See **DEPLOYMENT.md** for detailed instructions.

---

## 💡 Tips

- **View all services**: `docker-compose ps`
- **Follow all logs**: `docker-compose logs -f`
- **Clean everything**: `docker-compose down -v`
- **Rebuild one service**: `docker-compose build --no-cache auth-service`
- **Execute command in container**: `docker exec -it train_ticket_postgres psql -U postgres`
- **Check network**: `docker network inspect train_ticket_network`

---

## ⚠️ Important Notes

### Security
- ✅ Secrets are in `.env` (never commit!)
- ✅ Database passwords configured
- ✅ JWT tokens for API authentication
- ✅ HTTPS ready (configure SSL in Nginx)

### Email
- Currently uses Gmail SMTP (requires app password)
- Change to SendGrid/other service in `.env`
- For testing: check container logs

### Payment
- **Default**: SANDBOX mode (safe for testing)
- To use Razorpay: Set `PAYMENT_PROVIDER=RAZORPAY` and add keys

### Database
- Data persists in Docker volumes
- Daily backups recommended (production)
- Connection pool configured

---

## 🎯 Success Checklist

- [ ] `docker-compose up -d` runs without errors
- [ ] All services show "healthy" in `docker-compose ps`
- [ ] Frontend loads at http://localhost:5173
- [ ] Can register a user
- [ ] Can login with created account
- [ ] Can search trains
- [ ] Can create a booking
- [ ] Can initiate payment
- [ ] Email notifications working (check logs)

---

## 📞 Support

### Check Logs
```bash
docker-compose logs --tail=50 [service-name]
```

### Common Issues & Fixes
1. **Ports in use**: Change in docker-compose.yml
2. **Out of memory**: Increase Docker memory allocation
3. **Database issues**: Check PostgreSQL logs, restart container
4. **Payment failing**: Verify provider settings in `.env`
5. **Emails not sending**: Verify SMTP credentials in `.env`

### Documentation
See corresponding docs:
- README_FULL.md for features
- DEPLOYMENT.md for production
- SECURITY.md for security
- API_DOCS.json for API specs

---

**Version**: 1.0.0
**Last Updated**: September 2026
**Status**: 🎉 **PRODUCTION READY**
