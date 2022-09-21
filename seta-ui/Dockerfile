FROM python:3.9.10-bullseye

RUN apt update -y && apt-get install -y nodejs npm && useradd -m seta

ARG ROOT=/home/seta

RUN mkdir -p $ROOT/seta-frontend && mkdir -p $ROOT/seta-flask-server && mkdir -p $ROOT/models
COPY ./seta-flask-server/requirements.txt $ROOT/seta-flask-server/requirements.txt
WORKDIR $ROOT/seta-flask-server
RUN pip install -r requirements.txt

WORKDIR $ROOT/seta-frontend
RUN npm install -g npm@latest 
RUN npm update -g
RUN npm install -g @angular/cli@13.3.1 
#RUN ng update 

COPY ./seta-frontend/package.json $ROOT/seta-frontend/package.json
#RUN npm install --force
RUN npm install

COPY ./seta-frontend $ROOT/seta-frontend/
COPY ./seta-flask-server $ROOT/seta-flask-server

RUN ng build seta-web -c=docker
RUN cp -r /home/seta/seta-frontend/dist/seta-web/* /home/seta/seta-flask-server/seta-ui/ 
RUN rm -r  /home/seta/seta-frontend/*

#RUN ng build seta-web -c=docker --watch --optimization=false --build-optimizer=false --output-path=/home/seta/seta-flask-server/seta-ui/

RUN chown -R seta /home/seta 


CMD ["gunicorn", "--conf", "/home/seta/seta-flask-server/gunicorn_conf.py", "--bind", "0.0.0.0:8080", "--capture-output" , "--access-logformat", "[seta.ui] %(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s | %(f)s | %(a)s", "--chdir", "/home/seta/seta-flask-server", "app:app"]

