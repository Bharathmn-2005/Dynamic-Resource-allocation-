-- Legacy compatibility script for the Train Ticket Booking System.
-- Canonical PostgreSQL init scripts live in docker/postgres/.

\set ON_ERROR_STOP on

SELECT format('CREATE DATABASE %I', dbname)
FROM (VALUES
    ('auth_service'),
    ('booking_service'),
    ('payment_service'),
    ('notification_service')
) AS v(dbname)
WHERE NOT EXISTS (
    SELECT 1
    FROM pg_database
    WHERE datname = dbname
)
\gexec

\connect auth_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect booking_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect payment_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect notification_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\connect postgres
