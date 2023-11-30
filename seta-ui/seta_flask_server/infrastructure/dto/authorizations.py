authorizations = {
    "Bearer": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "description": "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token",
    },
    "CSRF": {
        "type": "apiKey",
        "in": "header",
        "name": "X-CSRF-TOKEN",
        "description": "Type in the *'Value'* input box below: **'&lt;CSRF&gt;'**, where CSRF is the CSRF token",
    },
}
