The data base used by SeTA is MongoDB, a free to use document database with the flexibility and scalability required for querying and indexing.
MongoDB stores data in adaptable, JSON-like documents with variable fields that can change from document to document and dynamic data structures.     

Powerful methods for accessing and analysing the data include ad hoc queries, indexing, and real-time aggregation.[^1]     

In SeTA due to some changes in the DataBase was necessary to use a migration tool to update the schema with existing data. The DB migration was done with the help of library ^^mongodb-migrations^^[^2]


The MongoDB migrations are part of the  **seta-ui** project.

First, you have to start a Bash shell in the **ui** Docker container:

```
docker exec -it ui bash
```

Next, execute the command below to update the database to the latest migration:

```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate
```

For Downgrading the migrations to a specific migration in the past, you need to pass a command line switch --downgrade --to_datetime <datetime>:
```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate --downgrade --to_datetime 20241030000000
```

[^1]: https://www.mongodb.com/what-is-mongodb
[^2]: https://github.com/DoubleCiti/mongodb-migrations

