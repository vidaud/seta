import os

import requests


# the following script test the proxy connection with the credentials given
def is_good_proxy(username, userpwd):
    try:
        # setting the proxy
        env_px = 'http://' + username + ':' + userpwd + '@autoproxy.cec.eu.int:8012'

        os.environ['HTTPS_PROXY'] = env_px

        url = requests.get('https://cordis.europa.eu/en', timeout=60)
        if url.status_code == 200:
            return True
    except requests.exceptions.HTTPError as e:
        print('Error code: ', e.strerror)
        return e.strerror
    except Exception as detail:
        print("ERROR:", detail)


def main():
    if is_good_proxy(username=None, userpwd=None):
        print("Good proxy")
    else:
        print("Bad proxy")


if __name__ == '__main__':
    main()
