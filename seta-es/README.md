# seta-es 🔎

The *seta-es* contains the elastic search image in dockers.

The files included are:

* docker-compose.yml
* Dockerfile
* Dockerfile-7.15.2
* Dockerfile-test

**docker-compose.yml**: This file allows you to configure and document the elastic search dependencies. Through this configuration it is possible to create and start the container with the single command (docker-compose up).

**Dockerfile**: The start docker file for the production environment.

**Dockerfile-7.15.2**: 

**Dockerfile-test**: The start docker file for the test environment.




## Build
***
The image is build it together with all the images

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