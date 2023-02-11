#FROM python:3.9.10-bullseye
FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
ENV https_proxy=$HTTP_PROXY
ENV http_proxy=$HTTP_PROXY
ENV no_proxy="seta-es,seta-mongo,seta-api,seta-nginx,seta-ui,seta-ui-spa"

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


ADD ./package.json $ROOT/package.json
ADD ./tsconfig.json $ROOT/tsconfig.json
ADD ./src $ROOT/src
ADD ./public $ROOT/public
RUN npm install

RUN npm run build

CMD chdir /home/seta/ \
    && serve -s build -l 3000
