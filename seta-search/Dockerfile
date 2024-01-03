FROM python:3.10-slim

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN useradd seta 
ARG ROOT=/home/seta

WORKDIR $ROOT

# set env variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./seta-search/requirements.txt $ROOT/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

#copy configuration files
COPY ./seta-config/search.conf /etc/seta/
COPY ./seta-config/logs.conf /etc/seta/

COPY ./seta-search/*.py ./
COPY ./seta-search/search ./search

CMD ["gunicorn", "--conf", "/home/seta/gunicorn_conf.py", "--bind", "0.0.0.0:8081", "--capture-output" , "--access-logformat", "[seta.search] %(h)s %(l)s %(u)s %(t)s. %(r)s. %(s)s %(b)s. %(f)s. %(a)s", "--chdir", "/home/seta", "app:app"]