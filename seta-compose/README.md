# seta-compose ⚙️


# Minimum requirements
  
* at least 10 GB available free RAM.

* 16 GR (32 GB preferred) RAM, 100 GB free space HDD or SSD (preferred).

* good Internet speed. You will need to download at least 5GB (> 20GB for all data)


The first run will take time. The next run will be fast.
 

# Docker composer

```

cd ./seta-compose

```
  

Create an ***.env*** file containing the variables as described in *.env.example*

The following commands will use by default the *docker-compose.yml* as the configuration file and *.env* as the environment file

```

docker compose build

docker compose up

```

*Notes:*

- it will setup all system and data.

- it will take a while depending on the Internet speed. Might take 30min to 2h.

- at some point there will be a message "SeTA-API is up and running."

After successfully start all the containers you are ready to open your browser and start typing:
 

* for UI: http://localhost/seta-ui

* for API http://localhost/seta-api/doc
  

```

#to stop gracefully the services:

CTRL + C

```
 

```

#start in detach mode:

docker-compose up -d

```

```

#stop services after detach mode

docker compose down

```
 

# Development environment
  

Create an ***.env.dev*** file containing the variables as described in *.env.example*

  

(Re-)build all images:

```

docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build

```

  

(Re-)build only seta-ui image:

```

docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build seta-ui

```

Start all services for your environment locally:

```

docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up

```

  

Start all services for your environment locally in detached mode:

```

docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up -d

```

  

Rebuild and restart seta-ui services while other services are runing:

```

docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up --force-recreate --build --no-deps seta-ui

```

  ## Shell scripts
Scripts as short commands for *'docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev'*

  ### Windows
  Run for development build and up:
 ```
dev-build.bat
dev-up.bat
 ```
Any arguments for the docker compose *build* or *up* commands will be appended in the batch scripts.
For example:
```
dev-build.bath --no-cache
 ```

###Linux

For execute permissions run:
```
chmod +x ./dev-build.sh
chmod +x ./dev-up.sh
```
Run for development build and up:
```
./dev-build.sh
./dev-up.sh
```
Any arguments for the docker compose *build* or *up* commands will be appended in the shell scripts.
For example:
```
./dev-build.sh --no-cache
```

# Test environment

Create an ***.env.test*** file containing the variables as described in *.env.example*
 
```
docker compose -f docker-compose-test.yml --env-file .env.test build
docker compose -f docker-compose-test.yml --env-file .env.test up
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/


