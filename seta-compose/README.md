# seta-compose ⚙️

The **seta-compose** image defines and run the  multi-container Docker applications. With Compose, we use a YAML file to configure the application services.

Compose folder has the commands for managing the whole lifecycle of the application:

    - Start, stop, and rebuild services
    - View the status of running services
    - Stream the log output of running services
    - Run a one-off command on a service


 > As part of the deployment in the project, for the execution of the image, please refer to the README.md file of the main project page.   

## Build
The image is build it together with all the images through the execution of the docker-compose

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


