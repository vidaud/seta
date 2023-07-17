The data base used by SeTA is MongoDB, a free to use document database with the flexibility and scalability required for querying and indexing.
MongoDB stores data in adaptable, JSON-like documents with variable fields that can change from document to document and dynamic data structures.     

Powerful methods for accessing and analysing the data include ad hoc queries, indexing, and real-time aggregation.[^1]     

MongoDB is a great NoSQL and schema-less database, but when the data schema changes and there is already data in database, is necessary a migration tool to update the existing data.

In SeTA the DB migration was done with the help of library **mongodb-migrations**[^2]

The procedure as described in the library GitHub project, leads to the execution of the following commands.

Run in the terminal of the **seta-ui docker container**:

```
MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrate --downgrade

MONGODB_MIGRATIONS_CONFIG=migrations/config.ini mongodb-migrateFix
```

The DB migrations will be something that can happen occasionally.

[^1]: https://www.mongodb.com/what-is-mongodb
[^2]: https://github.com/DoubleCiti/mongodb-migrations

