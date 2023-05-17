# seta-react 🌀 

* [.husky/](../seta-react/.husky)
  * [pre-commit](../seta-react/.husky/pre-commit)
* [docs/](../seta-react/docs)
  * [eslint-configuration.md](../seta-react/docs/eslint-configuration.md) - Contains the configuration for ESlint open-source library, to enforce rules about maintaining the code standard across the project.
* [public/](../seta-react/public)
  * [img/](../seta-react/public/img)
  * [favicon.ico](../seta-react/public/favicon.ico)
  * [logo192.png](../seta-react/public/logo192.png)
  * [logo512.png](../seta-react/public/logo512.png)
  * [manifest.json](../seta-react/public/manifest.json)
  * [robots.txt](../seta-react/public/robots.txt)
* [src/](../seta-react/src)  - stores all of source code that is used. Usually there are actions, components, pages/screens, reducers and routes/navigations.
  * [assets/](../seta-react/src/assets)
  * [common/](../seta-react/src/common)
  * [components/](../seta-react/src/components)
  * [environments/](../seta-react/src/environments)
  * [images/](../seta-react/src/images)
  * [layouts/](../seta-react/src/layouts)
  * [models/](../seta-react/src/models)
  * [pages/](../seta-react/src/pages)
  * [serializers/](../seta-react/src/serializers)
  * [services/](../seta-react/src/services)
  * [store/](../seta-react/src/store)
  * [types/](../seta-react/src/types)
  * [App.tsx](../seta-react/src/App.tsx)
  * [index.css](../seta-react/src/index.css)
  * [index.tsx](../seta-react/src/index.tsx)
  * [react-app-env.d.ts](../seta-react/src/react-app-env.d.ts)
  * [reportWebVitals.ts](../seta-react/src/reportWebVitals.ts)
* [.dockerignore](../seta-react/.dockerignore)
* [.eslintignore](../seta-react/.eslintignore)
* [.eslintrc.json](../seta-react/.eslintrc.json)
* [.lintstagedrc](../seta-react/.lintstagedrc)
* [.prettierignore](../seta-react/.prettierignore)
* [.prettierrc.json](../seta-react/.prettierrc.json)
* [changelog.txt](../seta-react/changelog.txt)
* [Dockerfile](../seta-react/Dockerfile)
* [Dockerfile-dev](../seta-react/Dockerfile-dev)
* [package-lock.json](../seta-react/package-lock.json)
* [package.json](../seta-react/package.json)
* [tsconfig.json](../seta-react/tsconfig.json)



The *seta-react* contains the image that launch the web app of SeTA project.

Within the Dockerfile is stablished the configuration for the execution of the app so it can be executed when the build of the project is launched.


## Build
The image is build it together with all the images through the execution of the docker compose:
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
