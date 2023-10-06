#!/bin/bash

docker compose -f docker-compose-test.yml --env-file .env.test up $@
