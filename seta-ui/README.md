# seta-ui

The **seta ui**  contains the necessary files including the python scripts for the setup of the UI image:

- ./seta_flask_server
- ./seta-flask-server
- ./tests
- app_dev.py
- app_test.py
- app.py



### (re-)build
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev build seta-ui
```
+ Start all services for your environment locally:
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up
```
+ Start all services for your environment locally in detached mode:
```
    docker compose -f docker-compose.yml -f docker-compose-dev.yml --env-file .env.dev up -d
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/