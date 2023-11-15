## Mongo Migrations

### Documentation: 

[mongodb-migrations](https://github.com/DoubleCiti/mongodb-migrations)

### Command

Run in the terminal of the ***seta-ui*** docker container:
```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate
```

For Downgrading the migrations to a specific migration in the past, you need to pass a command line switch --downgrade --to_datetime <datetime>:
```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate --downgrade --to_datetime 20241030000000
```