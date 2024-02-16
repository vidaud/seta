## Seta-ui Testing

Seta-ui is using pytest for functional and unit testing.

### Usage
    For testing in docker run: 
    pytest -s tests/ --settings=REMOTE

### Configuration

Create a file with name *secrets.conf* for [configparser](https://docs.python.org/3.10/library/configparser.html) that looks like this:

```
[TEST]
# same secret as in seta-compose/.env.test
API_SECRET_KEY= 

# not used in testing
GITHUB_CLIENT_ID=not-used
GITHUB_CLIENT_SECRET=not-used
```

The configuration file is read by ConfigParser in *conftest.py*, *init_os* fixture.

Note: This file name is set to be ignored by git in *.gitignore*.