FROM ubuntu:20.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
ENV https_proxy=$HTTP_PROXY
ENV http_proxy=$HTTP_PROXY
ENV no_proxy="seta_es,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-spa"

RUN apt update -y
RUN apt install -y  --no-install-recommends curl
RUN apt install -y  --no-install-recommends wget
RUN apt install -y  --no-install-recommends openjdk-11-jre
RUN apt install -y  --no-install-recommends nodejs 
RUN apt install -y  --no-install-recommends npm
RUN apt install -y  --no-install-recommends gnupg
RUN apt install -y  --no-install-recommends python3-pip
RUN apt install -y  --no-install-recommends python3-dev

RUN npm install elasticdump -g
RUN useradd seta 

ARG ROOT=/home/seta
WORKDIR $ROOT

RUN chown -R seta /home/seta 

RUN mkdir $ROOT/tika
WORKDIR $ROOT/tika
RUN wget https://archive.apache.org/dist/tika/2.4.1/tika-app-2.4.1.jar \
    && wget https://archive.apache.org/dist/tika/2.4.1/tika-app-2.4.1.jar.asc \
    && wget https://archive.apache.org/dist/tika/KEYS \
    && gpg --import KEYS \
    && gpg --verify tika-app-2.4.1.jar.asc tika-app-2.4.1.jar

WORKDIR $ROOT
COPY requirements.txt $ROOT/requirements.txt
RUN pip3 install -r $ROOT/requirements.txt 
RUN  python3 -m nltk.downloader punkt 
RUN python3 -c 'from sentence_transformers import SentenceTransformer; SentenceTransformer("all-distilroberta-v1")'

ADD ./*.py ./
ADD ./apis ./apis
ADD ./infrastructure ./infrastructure
ADD ./static ./static

ENV FLASK_DEBUG=0
ENV FLASK_RUN_PORT=8081
ENV FLASK_APP=app.py 
ENV FLASK_ENV=production
#log setup
ENV LOG_TYPE="watched"

CMD ["gunicorn", "--conf", "/home/seta/gunicorn_conf.py", "--bind", "0.0.0.0:8081", "--capture-output" , "--access-logformat", "[seta.api] %(h)s %(l)s %(u)s %(t)s. %(r)s. %(s)s %(b)s. %(f)s. %(a)s", "--chdir", "/home/seta", "app:app"]
