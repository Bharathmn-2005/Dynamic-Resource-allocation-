-- Train Ticket Reservation System - PostgreSQL Initialization Script
-- This script creates all required databases for the microservices

-- ============================================================================
-- Create Databases
-- ============================================================================

-- Authentication Service Database
CREATE DATABASE auth_service
  WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Booking Service Database
CREATE DATABASE booking_service
  WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Payment Service Database
CREATE DATABASE payment_service
  WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Notification Service Database
CREATE DATABASE notification_service
  WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- ============================================================================
-- Enable PostgreSQL Extensions (optional but recommended)
-- ============================================================================

-- Connect to auth_service
\c auth_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Connect to booking_service
\c booking_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Connect to payment_service
\c payment_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Connect to notification_service
\c notification_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================================================
-- Verify Database Creation
-- ============================================================================
\c postgres
SELECT datname FROM pg_database WHERE datname LIKE '%_service' ORDER BY datname;
