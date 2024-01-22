# Testing SeTA

## Web APIs Tests

Each web service project features a `tests` directory, housing a suite of tests designed to validate the API's functionality. These tests are written using the Pytest framework.

## UI Web API

### Configuration

Create a file with name *test.conf* for [configparser](https://docs.python.org/3.10/library/configparser.html) that looks like this:

```
[TEST]
# same secret as in seta-compose/.env.test
API_SECRET_KEY = 

# not used in testing
GITHUB_CLIENT_ID = not-used
GITHUB_CLIENT_SECRET = not-used
```

The configuration file is read by ConfigParser in *conftest.py*, *init_os* fixture.

### Running the Tests
To run the tests, navigate to the `seta-ui`` directory in your terminal and run the following command:

```
pytest -s tests/
```

This command will discover and run all tests in the `seta-ui/tests`` directory and display the results in the terminal.

## Search Web API

To run the tests, navigate to the `seta-search` directory in your terminal and run the following command:

```
pytest -s tests/
```

## NLP Web API

To run the tests, navigate to the `seta-nlp` directory in your terminal and run the following command:

```
pytest -s tests/
```