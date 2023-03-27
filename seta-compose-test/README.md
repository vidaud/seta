# seta-compose-test ⚙️

The *seta-compose-test* container defines and run the  multi-container Docker applications. With Compose, we use a YAML file to configure the application services.

## Minimum requirements

* at least 10 GB available free RAM.

* 16 GR (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* good Internet speed. You will need to download at least 5GB (> 20GB for all data)

The first run will take time. The next run will be fast.


## Docker composer
```
    cd ./seta-compose-test
```    

Create an ***.env*** file containing the variables as described in *.env.example*
The following commands will use by default the *docker-compose-test.yml* as the configuration file and *.env* as the environment file

```
    docker compose -f docker-compose-test.yml build
    docker compose -f docker-compose-test.yml up
```

_Notes:_
- It will setup all system and data.\
- It will take a while depending on the Internet speed. Might take 30min to 2h.\
- At some point there will be a message *"SeTA-API is up and running."*


After successfully start all the containers you are ready to open your browser and start typing:
* **for UI:** http://localhost/seta-ui
* **for API:** http://localhost/seta-api/doc

### To stop services:
```
    CTRL + C
```
* Start in detach mode:
```
    docker-compose-test up -d
```

* Stop services after detach mode
```
    docker compose down
```
## Development environment

+ Create an ***.env.dev*** file containing the variables as described in *.env.example*

### (re-)build all images
```
    docker compose -f docker-compose-test.yml -f docker-compose-dev.yml --env-file .env.dev build
```
### (re-)build only seta-ui image
```
    docker compose -f docker-compose-test.yml -f docker-compose-dev.yml --env-file .env.dev build seta-ui
```
+ Start all services for your environment locally:
```
    docker compose -f docker-compose-test.yml -f docker-compose-dev.yml --env-file .env.dev up
```
+ Start all services for your environment locally in detached mode:
```
    docker compose -f docker-compose-test.yml -f docker-compose-dev.yml --env-file .env.dev up -d
```
### Rebuild and restart seta-ui services while other services are runing:  
```
    docker compose -f docker-compose-test.yml -f docker-compose-dev.yml --env-file .env.dev up --force-recreate --build --no-deps seta-ui
```

For Linux, there are two shell files *dev-build.sh* and *dev-up.sh* as shorts commands for docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev

For execute permissions run:
```
    chmod +x ./dev-build.sh
    chmod +x ./dev-up.sh
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/
