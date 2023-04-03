# seta-mongo 💾 

The *seta-mongo* image contains the configuration files necessary for the Mongo Data Base container.

The seta-mongo connects the MongoDB Atlas, the Database-as-a-Service offering by MongoDB. 

The application is connected to the MongoDB through an environment variable.


## Build

The image is build it together with all the images through the execution of the docker-compose:

```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/