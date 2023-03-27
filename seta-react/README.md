# seta-react 🌀 

The *seta-react* contains the image that works to launch the web app of SeTA project.

Within the Dockerfile is stablished the configuration for the execution of the app so it can be executed when the build of the project is launched.


The image can be built by running:
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
