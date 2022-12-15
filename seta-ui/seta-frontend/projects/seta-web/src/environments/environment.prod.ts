export const environment = {
  production: true,
  test: false,
  baseUrl: `https://seta.emm4u.eu/`,
  baseApplicationContext: `/seta-ui/`,
  restEndPoint: `rest/v1/`,
  _regex: new RegExp(`_`, `g`),
  baseFlaskBackendUrl: "https://seta.emm4u.eu/",
  loginTokenExpiryInterval: 60 // In minutes
};
