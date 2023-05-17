#FROM python:3.9.10-bullseye
FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN apt update -y && apt install -y --no-install-recommends  nodejs npm
RUN apt install -y  --no-install-recommends curl

RUN npm update -g
RUN npm install -g n
RUN n lts

RUN npm install -g serve
RUN npm install -g npm

ARG ROOT=/home/seta

WORKDIR $ROOT

COPY ./package.json .
RUN npm install

COPY ./tsconfig.json .
COPY ./vite.config.js .
COPY ./index.html .
COPY ./src ./src
COPY ./public ./public

RUN npm run build

CMD chdir /home/seta/ \
    && serve -s build -l 3000
