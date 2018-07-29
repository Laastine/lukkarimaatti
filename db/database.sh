#!/usr/bin/env bash

set -eou pipefail

function print_status {
  if [[ $1 -eq 0 ]]; then
    printf "\n[OK]\n"
  else
    printf "\n[FAIL]\n"
  fi
}

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 [start|stop]"
elif [ "$1" = "start" ]; then
  echo "Starting PostgreSQL server"
  postgres -D lukkarimaatti-db
  EXIT_STATUS=$?

  printf 'PostgreSQL server started'
  print_status EXIT_STATUS
elif [ "$1" = "stop" ]; then
  echo "Stoping PostgreSQL server"
  pg_ctl -D lukkarimaatti-db stop -s -m fast
  EXIT_STATUS=$?

  printf 'PostgreSQL server stopped'
  print_status EXIT_STATUS
fi
