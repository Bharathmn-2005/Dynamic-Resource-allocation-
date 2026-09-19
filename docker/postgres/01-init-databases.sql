-- Train Ticket Booking System PostgreSQL initialization
-- Creates the service databases and enables uuid-ossp in each one.

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
