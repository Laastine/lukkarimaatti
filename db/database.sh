#!/usr/bin/env bash

set -eou pipefail

DBNAME="postgres"
DATADIR="lukkarimaatti-db"

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 [init|start|stop]"
elif [ "$1" = "init" ]; then
  echo "Initializing database"
  initdb $DATADIR

  postgres -D $DATADIR > db.log 2>&1 &
  echo $! > postgres.pid
  sleep 3
  createuser postgres
  psql $DBNAME -f init.sql

elif [ "$1" = "start" ]; then
  echo "Starting PostgreSQL server"
  postgres -D lukkarimaatti-db
  EXIT_STATUS=$?

  printf 'PostgreSQL server started'
elif [ "$1" = "stop" ]; then
  echo "Stoping PostgreSQL server"
  pg_ctl -D lukkarimaatti-db stop -s -m fast
  EXIT_STATUS=$?

  printf 'PostgreSQL server stopped'
fi
