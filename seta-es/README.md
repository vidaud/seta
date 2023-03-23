# seta-es 🔎

The **seta-es** contains the elastic search image in dockers.

The files included are:

* docker-compose.yml
* Dockerfile
* Dockerfile-7.15.2
* Dockerfile-test

**docker-compose.yml**: This file allows you to configure and document the elastic search dependencies. Through this configuation it is possible to create and start the container with the single command (docker-compose up).

**Dockerfile**: The start docker file for the production environment.

**Dockerfile-test**: The start docker file for the test environment.



## License


[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/