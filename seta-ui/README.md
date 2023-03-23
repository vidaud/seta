# SeTA *Semantic Text Analyser*

SeTA is a new tool that applies advanced text analysis techniques to large document collections, helping policy analysts to understand the concepts expressed in thousands of documents and to see in a visual manner the relationships between these concepts and their development over time. 

## General Overview 

This project is made up of two modules, the **frontend** and the **flask-server** one. 
**Seta-frontend** is an *React* standard workspace enabled application.  
**Seta-middleware** is a standard `maven-archetype-webapp` 
**Seta-flask-server** is a Flask application 
The frontend module contains all the static reaources that make up the UI business logic  
The middleware module contains all the java sources and acts as a proxy / integration layer towards the backend. 
The flask-server module contains all the python sources and acts as a proxy / authentication layer towards the backend.  



All static resources that ensue from `ng build seta-web -c=<environment>` of the the frontend module are copied inside the flask-server **seta-ui** folder's module.  
The end result is a ***seta-flask-server*** folder that contains a Flask application that can be deployed on any web container.  
Flask configurations files are:
 - seta-flask-server/config.py
 - seta-flask-server/.env
 
 Angular configuration files are:
 - package.json
 - angular.json

## Installation

Create a new virtual environment by choosing a Python interpreter and making a ./venv directory to hold it:


    python3 -m venv --system-site-packages ./venv


Activate the virtual environment using a shell-specific command:

**source ./venv/bin/activate  # sh, bash, or zsh ../venv/bin/activate.fish  # fish source ./venv bin/activate.csh  # csh or tcsh**

When the virtual environment is active, your shell prompt is prefixed with (venv).

    /venv


Install packages within a virtual environment without affecting the host system setup. Start by upgrading pip :

    python -m pip install -U pip


Clone with 

    git clone https://alm.emm4u.eu/seta/seta-new.git

Then install all requirements:

    python -m pip install -r requirements.txt

If you have issue with ImportError: No module named _internal than probably you are using an old version of pip. Issue is described here

    python -m pip install -U --force-reinstall -r requirements.txt
Inside the project home run:

    ./run_debug_server.sh



## Deployment procedure


1. Build the angular code using the command ng build seta-web -c=test
2. Copy (overwrite everything) everything over from seta-frontend/dist/seta-web/ to seta-flask-server/seta-ui/
3. Make a new commit on that-branch-name, for commit message, put some message like "Build of previous commits."
3. Go to seta-test server, i.e:
    - ssh <username>@works1.emm.tdm.jrc.eu
    - ssh <username>@seta-test.emm.tdm.jrc.eu
    - sudo su - seta
    - enter your server password
4. Checkout that branch, i.e:
    - cd seta-new-ui
    - git checkout that-branch-name
    - enter your git credentials 
5. Restart flask server (start from step 'c' if you are already ssh-ed on the correct server) i.e:
    - ssh <username>@works1
    - ssh <username>@seta-test
    - sudo su
    - insert admin password
    - systemctl restart seta-ui
    - systemctl status seta-ui (just to check that guinorn is restarted)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![MIT][mit-badge]][mit-url]

[mit-badge]: https://img.shields.io/badge/license-mit-blue
[mit-url]: https://choosealicense.com/licenses/mit/