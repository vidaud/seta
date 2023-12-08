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

COPY ./seta-admin/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#copy configuration file
COPY ./seta-config/data.conf /etc/seta/

COPY ./seta-admin/admin $ROOT/admin
COPY ./seta-admin/*.py ./
COPY ./seta-admin/logging.conf ./logging.conf

CMD ["uvicorn", "--factory", "main:create_app", "--host=0.0.0.0", "--port=8000", "--no-access-log"]
