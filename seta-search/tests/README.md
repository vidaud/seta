## Seta-Search Testing

Seta-Search is using pytest for functional and unit testing.

### Usage
    For testing in docker run: 
    pytest -s tests/ --settings=REMOTE

### Configuration

Modify the *test.conf* file to suit your testing environment.

The configuration file is read by [ConfigParser](https://docs.python.org/3.10/library/configparser.html) in *conftest.py*, *init_os* fixture.