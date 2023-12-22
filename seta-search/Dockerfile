FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN apt update -y
RUN apt install -y  --no-install-recommends curl
RUN apt install -y  --no-install-recommends wget
RUN apt install -y  --no-install-recommends openjdk-11-jre
RUN apt install -y  --no-install-recommends gnupg
RUN apt install -y  --no-install-recommends python3-pip
RUN apt install -y  --no-install-recommends python3-dev
RUN apt install -y  --no-install-recommends libmagic-dev
RUN pip install --upgrade pip

RUN useradd seta 
ARG ROOT=/home/seta
WORKDIR $ROOT

RUN chown -R seta /home/seta 

RUN export  https_proxy=$HTTPS_PROXY
RUN export  http_proxy=$HTTP_PROXY


COPY ./seta-api/requirements.txt $ROOT/requirements.txt

WORKDIR $ROOT
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./seta-search/*.py ./
COPY ./seta-search/search ./search

#copy configuration files
COPY ./seta-config/search.conf /etc/seta/
COPY ./seta-config/logs.conf /etc/seta/

CMD ["gunicorn", "--conf", "/home/seta/gunicorn_conf.py", "--bind", "0.0.0.0:8081", "--capture-output" , "--access-logformat", "[seta.search] %(h)s %(l)s %(u)s %(t)s. %(r)s. %(s)s %(b)s. %(f)s. %(a)s", "--chdir", "/home/seta", "app:app"]