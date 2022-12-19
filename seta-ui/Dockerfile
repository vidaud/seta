FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
ENV https_proxy=$HTTP_PROXY
ENV http_proxy=$HTTP_PROXY
ENV no_proxy="seta-es,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-spa"

RUN apt update -y 
RUN apt install -y  --no-install-recommends curl
RUN apt install -y  --no-install-recommends wget
RUN apt install -y  --no-install-recommends python3-pip

RUN useradd -m seta

ARG ROOT=/home/seta

#set UTC timezone
RUN apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/UTC /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

RUN mkdir -p $ROOT/seta-flask-server && mkdir -p $ROOT/models && mkdir -p $ROOT/seta-flask-server/seta-ui
COPY ./seta-flask-server/requirements.txt $ROOT/seta-flask-server/requirements.txt
WORKDIR $ROOT/seta-flask-server
RUN pip install -r requirements.txt

ADD ./seta-flask-server $ROOT/seta-flask-server


ENV ROOT_USERS="vidas.daudaravicius@ec.europa.eu;lucia.noce@ext.ec.europa.eu;Andrei.Patrascu@ext.ec.europa.eu;adriana.lleshi@ext.ec.europa.eu"
ENV FLASK_ENV="production"
ENV FLASK_APP=app.py
ENV FLASK_RUN_PORT=8080
ENV FLASK_DEBUG=0
#ENV FLASK_PATH="https://seta-dev.jrc.cec.eu.int"
ENV API_TARGET_PATH="seta-api:8081/seta-api/api/v1"

CMD ["gunicorn", "--conf", "/home/seta/seta-flask-server/gunicorn_conf.py", "--bind", "0.0.0.0:8080", "--capture-output" , "--access-logformat", "[seta.ui] %(h)s %(l)s %(u)s %(t)s %(r)s %(s)s %(b)s | %(f)s | %(a)s", "--chdir", "/home/seta/seta-flask-server", "app:app"]
