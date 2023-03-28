export const environment = {
  production: false,
  test: false,
  baseUrl: `http://localhost`,
  baseApplicationContext: `/`,
  restEndPoint: `rest/`,
  _regex: new RegExp(`_`, `g`),
  baseFlaskBackendUrl: 'http://localhost:8080',
  loginTokenExpiryInterval: 60, // In minutes

  //api_target_path: `https://seta-test.emm4u.eu/seta-api/seta/api/v1/`,
  api_target_path: `http://localhost/seta-api/api/v1/`,
  //token_key: 'accessToken',
  //refreshtoken_key: 'refreshToken',
  token_key: 'csrf_access_token',
  refreshtoken_key: 'csrf_refresh_token'
}
