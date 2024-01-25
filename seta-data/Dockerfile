FROM python:3.10-slim

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

#RUN cat /etc/apt/apt.conf
ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN useradd seta 

ARG ROOT=/home/seta

WORKDIR $ROOT
COPY ./seta-data/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt 

#copy configuration file
COPY ./seta-config/data.conf /etc/seta/

COPY ./seta-data/src ./
RUN mkdir $ROOT/models_docker
COPY ./seta-data/models ./models_docker

CMD ["python3", "/home/seta/app.py"]
