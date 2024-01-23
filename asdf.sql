
-- Create a shared role for developers
CREATE ROLE developers;
ALTER ROLE developers WITH CREATEDB CREATEROLE;

-- Define developer account(s)
CREATE USER dev_joshs 
    WITH PASSWORD 'changeme';

GRANT developers TO dev_joshs;

-- Create a database for the project
CREATE DATABASE eztrack 
    WITH OWNER = developers 
    ENCODING = 'UTF8' 
    TABLESPACE = pg_default 
    LC_COLLATE = 'en_US.UTF-8' 
    LC_CTYPE = 'en_US.UTF-8' 
    CONNECTION LIMIT = -1 
    TEMPLATE template0;

-- Grant privileges to developers role
GRANT ALL PRIVILEGES 
    ON DATABASE eztrack 
    TO developers;

-- Create a role for Express server
CREATE ROLE eztrack_development_npe 
    WITH PASSWORD 'changeme';

-- Grant privileges to Express server role
GRANT CONNECT 
    ON DATABASE eztrack 
    TO eztrack_npe_group;

-- Connect to the database
\c eztrack

-- Grant privileges to developers role
GRANT ALL PRIVILEGES 
    ON SCHEMA public 
    TO developers;

-- Grant privileges to Express server role
GRANT USAGE 
    ON SCHEMA public 
    TO eztrack_npe_group;

-- Grant sequence privileges to Express server role
GRANT ALL PRIVILEGES
    ON ALL SEQUENCES
    IN SCHEMA public
    TO eztrack_npe_group;

GRANT SELECT, INSERT, UPDATE, DELETE 
    ON ALL TABLES IN SCHEMA public 
    TO eztrack_npe_group;

ALTER DEFAULT PRIVILEGES 
    IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE 
    ON TABLES 
    to eztrack_npe_group;

-- Generate session table

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- END Generate session table

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eztrack_npe;