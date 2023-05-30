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

RUN useradd seta 
ARG ROOT=/home/seta
WORKDIR $ROOT

RUN chown -R seta /home/seta 

RUN export  https_proxy=$HTTPS_PROXY
RUN export  http_proxy=$HTTP_PROXY

RUN mkdir -p $ROOT/tika
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

COPY ./*.py ./
COPY ./seta_api ./seta_api

#log setup
#ENV LOG_TYPE="watched"

CMD ["gunicorn", "--conf", "/home/seta/gunicorn_conf.py", "--bind", "0.0.0.0:8081", "--capture-output" , "--access-logformat", "[seta.api] %(h)s %(l)s %(u)s %(t)s. %(r)s. %(s)s %(b)s. %(f)s. %(a)s", "--chdir", "/home/seta", "app:app"]

#for error displays:
#CMD flask --app app --debug run -h "0.0.0.0" --port 8081
