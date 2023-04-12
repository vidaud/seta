# seta-react 🌀 

The *seta-react* contains the image that works to launch the web app of SeTA project.

Within the Dockerfile is stablished the configuration for the execution of the app so it can be executed when the build of the project is launched.

.
└── seta-react/     
    ├── .husky    
    ├── docs/     
    │   └── eslint-configuration.md     
    ├── node-modules     
    ├── public     
    ├── src    
    ├── dockerfile    
    └── file/    
        ├── and   
        ├── folder   
        ├── nesting.   
        └── You can even/   
            └── use/     
                ├── markdown    
                └── bullets!      
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
