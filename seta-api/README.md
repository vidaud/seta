# seta-api 📃

The **seta API**  contains the files necesary to create new communities through a simple API rest call. It receives the requests about a specific resource on the seta server and creates it.


The subfolder contains folders, docker files and configuration files for the execution of the API:

* cd .\apis 
* cd .\infrastructure
* cd .\models
* cd .\results
* cd .\seta_api
* cd .\tests
* app.py
* app_dev.py
* app_test.py
* docker-compose.yml
* Dockerfile
* Dockerfile-dev-flask
* Dockerfile-test
* gunicorn_conf.py \


## Build
***
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