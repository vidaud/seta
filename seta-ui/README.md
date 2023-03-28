# seta-ui 🏁

The **seta ui**  folder contains the configuration that enables the access to the web app. \
In the files **seta-flask-server** it is possible to replicate the application across different servers with minimal reconfiguration. \
In this folder it is included the code to support the seta-api to validate the authentication token.


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