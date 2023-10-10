FROM ubuntu:22.04

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

#RUN cat /etc/apt/apt.conf
ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN apt update -y
RUN apt install -y  --no-install-recommends python3-pip
RUN apt install -y  --no-install-recommends python3-dev
RUN apt install -y  --no-install-recommends wget
RUN pip install --upgrade pip

RUN useradd seta 

ARG ROOT=/home/seta

WORKDIR $ROOT
COPY ./seta-data/requirements.txt $ROOT/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r $ROOT/requirements.txt 

COPY ./seta-data/src $ROOT
RUN mkdir $ROOT/models_docker
COPY ./seta-data/models $ROOT/models_docker

#copy configuration file
COPY ./seta-config/data.conf /etc/seta/

#CMD "ls -l /home/seta &&  python /home/seta/app.py"
CMD ["python3", "/home/seta/app.py"]
