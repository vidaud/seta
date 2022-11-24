FROM python:3.9.10-bullseye

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
ENV https_proxy=$HTTP_PROXY
ENV http_proxy=$HTTP_PROXY
ENV no_proxy="seta-es,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-spa"

RUN apt update -y && apt-get install -y nodejs npm && useradd -m seta

ARG ROOT=/home/seta

RUN mkdir -p $ROOT/seta-frontend && mkdir -p $ROOT/seta-flask-server && mkdir -p $ROOT/models  && mkdir -p $ROOT/seta-flask-server/seta-ui
COPY ./seta-flask-server/requirements.txt $ROOT/seta-flask-server/requirements.txt
WORKDIR $ROOT/seta-flask-server
RUN pip install -r requirements.txt

WORKDIR $ROOT/seta-frontend
RUN npm install -g npm@8.19.2
#RUN npm update -g
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

ENV ROOT_USERS=["vidas.daudaravicius@ec.europa.eu","lucia.noce@ext.ec.europa.eu"] 
ENV FLASK_ENV="production"
ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=8080
ENV FLASK_DEBUG=0
ENV FLASK_PATH="https://seta-dev.jrc.cec.eu.int"
ENV API_TARGET_PATH="seta-api:8081/seta-api/api/v1"
#log setup
ENV LOG_TYPE="watched"

CMD ["gunicorn", "--conf", "/home/seta/seta-flask-server/gunicorn_conf.py", "--bind", "0.0.0.0:8080", "--capture-output" , "--access-logformat", "[seta.ui] %(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s | %(f)s | %(a)s", "--chdir", "/home/seta/seta-flask-server", "app:app"]
