#!/usr/bin/env bash

set -eou pipefail

DBNAME="postgres"
DATADIR="lukkarimaatti-db"

initdb $DATADIR

postgres -D $DATADIR > db.log 2>&1 &
echo $! > postgres.pid
sleep 3
createuser postgres

psql $DBNAME << EOF
GRANT ALL PRIVILEGES ON database postgres to postgres;
CREATE SCHEMA IF NOT EXISTS lukkarimaatti AUTHORIZATION postgres;
GRANT ALL ON SCHEMA lukkarimaatti TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA lukkarimaatti TO postgres;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOF
