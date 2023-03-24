#FROM python:3.9.10-bullseye
FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN apt update -y && apt install -y --no-install-recommends  nodejs npm && mkdir /home/seta
RUN apt install -y  --no-install-recommends curl

ARG ROOT=/home/seta
WORKDIR $ROOT

RUN npm update -g
RUN npm install -g n
RUN n lts
RUN npm install -g primereact
RUN npm install -g primeicons
RUN npm install -g axios
RUN npm install -g serve
RUN npm install -g npm

#RUN ng update -g


COPY ./package.json $ROOT/package.json
COPY ./tsconfig.json $ROOT/tsconfig.json
COPY ./src $ROOT/src
COPY ./public $ROOT/public
RUN npm install

RUN npm run build

CMD chdir /home/seta/ \
    && serve -s build -l 3000
