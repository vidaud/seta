## Mongo Migrations

### Documentation: 

[mongodb-migrations](https://github.com/DoubleCiti/mongodb-migrations)

### Command

Run in the terminal of the ***seta-ui*** docker container:
```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate
```

For Downgrading the migrations, you need to pass a command line switch --downgrade:
```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate --downgrade
```