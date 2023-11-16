## Seta-ui Testing

Seta-ui is using pytest for functional and unit testing.

### Usage
    For testing in docker run: 
    pytest -s tests/ --db_host=seta-mongo-test --db_port=27017 --db_name=seta-test --api_root=seta-api-test:8081 --auth_root=seta-auth-test:8082

### Configuration

Create a file with name *test.conf* for [configparser](https://docs.python.org/3.10/library/configparser.html) that looks like this:

```
[DEFAULT]
# same secret as in seta-compose/.env.test
API_SECRET_KEY = 

# not used in testing
GITHUB_CLIENT_ID = not-used
GITHUB_CLIENT_SECRET = not-used
```

The configuration file is read by ConfigParser in *conftest.py*, *init_os* fixture.

Note: This file name is set to be ignored by git in *seta-ui/.gitignore*.