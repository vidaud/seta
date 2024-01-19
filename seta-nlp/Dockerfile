FROM python:3.10-slim

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

RUN export https_proxy=$HTTPS_PROXY
RUN export http_proxy=$HTTP_PROXY

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TIKA_PATH="tika/tika-app-2.4.1.jar"

RUN apt update -y   \
    && apt install -y --no-install-recommends \
    wget \
    default-jre \
    libmagic1 \
    && apt install -y gpg

RUN useradd seta 
ARG ROOT=/home/seta

RUN mkdir -p $ROOT/tika
WORKDIR $ROOT/tika

RUN wget https://archive.apache.org/dist/tika/2.4.1/tika-app-2.4.1.jar \
    && wget https://archive.apache.org/dist/tika/2.4.1/tika-app-2.4.1.jar.asc \
    && wget https://archive.apache.org/dist/tika/KEYS \
    && gpg --import KEYS \
    && gpg --verify tika-app-2.4.1.jar.asc tika-app-2.4.1.jar

WORKDIR $ROOT

COPY ./seta-nlp/requirements_model.txt .
RUN pip install --no-cache-dir -r requirements_model.txt

RUN python3 -m nltk.downloader punkt \
    && python3 -c 'from sentence_transformers import SentenceTransformer; SentenceTransformer("all-distilroberta-v1")'

COPY ./seta-nlp/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

#copy configuration files
COPY ./seta-config/logging.conf /etc/seta/
COPY ./seta-config/nlp.conf /etc/seta/

COPY ./seta-nlp/nlp ./nlp
COPY ./seta-nlp/*.py .

ENTRYPOINT ["gunicorn", "main:create_app()", "--worker-class", "uvicorn.workers.UvicornWorker", "--name=nlp", "--bind=0.0.0.0:8000"]
