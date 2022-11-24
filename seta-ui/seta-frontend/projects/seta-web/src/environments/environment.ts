// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  test: false,
  baseUrl: `http://localhost:8080`,
  baseApplicationContext: `/seta-ui/`,
  restEndPoint: `rest/`,
  _regex: new RegExp(`_`, `g`),
  baseFlaskBackendUrl: "http://localhost:8080",
  loginTokenExpiryInterval: 60, // In minutes

  api_target_path: `https://seta-test.emm4u.eu/seta-api/seta/api/v1/`,  
  token_key: 'accessToken',
  refreshtoken_key: 'refreshToken',


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
