FROM python:3.10-slim as docs

RUN echo "Acquire::http::Proxy \""$HTTP_PROXY"\";" >> /etc/apt/apt.conf
RUN echo "Acquire::https::Proxy \""$HTTPS_PROXY"\";" >> /etc/apt/apt.conf

#RUN cat /etc/apt/apt.conf
ENV https_proxy=$HTTPS_PROXY
ENV http_proxy=$HTTP_PROXY

ENV HTTPS_PROXY=$HTTPS_PROXY
ENV HTTP_PROXY=$HTTP_PROXY

ARG ROOT=/home/seta
RUN useradd seta

COPY requirements.txt $ROOT/requirements.txt

WORKDIR $ROOT
RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir -r ./requirements.txt && \
    python3 -m pip check

COPY . $ROOT

RUN ["mkdocs", "build"]

FROM nginx:1.20.2
COPY --from=docs /home/seta/site /usr/share/nginx/html