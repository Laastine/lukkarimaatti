GRANT ALL PRIVILEGES ON database postgres to postgres;
CREATE SCHEMA IF NOT EXISTS lukkarimaatti AUTHORIZATION postgres;
GRANT ALL ON SCHEMA lukkarimaatti TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA lukkarimaatti TO postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
