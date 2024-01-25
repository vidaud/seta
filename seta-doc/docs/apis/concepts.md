## Access Token

The access token is a string which contains the credentials and permissions that can be used to access SeTA resources.

You must include the following header in your API calls:

* Header parameter: _Authorization_
* Value: _Bearer  &lt;Access Token_&gt;

## API calls

The SeTA Web API is a restful API with endpoints which return JSON formatted data.

### Requests

 Web API endpoints are accessed via standard HTTP requests in UTF-8 format using the following HTTP verbs: **GET**, **POST**, **PUT** and **DELETE**.

### Responses

The API returns JSON in the response body and uses status codes defined by [RFC 2616](https://www.ietf.org/rfc/rfc2616.txt) and [RFC 6585](https://www.ietf.org/rfc/rfc6585.txt).