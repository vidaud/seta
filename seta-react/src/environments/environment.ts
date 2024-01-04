export const environment = {
  production: false,
  test: false,
  baseUrl: `/seta-ui/api/v1`,
  authenticationUrl: `/authentication/v1`,
  _regex: new RegExp(`_`, `g`),
  baseFlaskBackendUrl: 'http://localhost:8080',
  loginTokenExpiryInterval: 60, // In minutes
  searchApiRoot: `/seta-search/api/v1`,
  nlpApiRoot: `/seta-nlp`,
  token_key: 'csrf_access_token',
  refreshtoken_key: 'csrf_refresh_token',
  EU_Analytics_Site_ID: 'b240c41b-yyyyy-40af-96ef-xxxxxxxx'
}
