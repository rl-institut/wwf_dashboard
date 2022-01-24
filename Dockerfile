FROM python:3.8.0-slim

RUN apt-get update && \
    apt-get install -y \
        build-essential \
        make \
        gcc \
        libffi6 libffi-dev libcairo2-dev 

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt 

RUN apt-get remove -y --purge make gcc build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY ./ /app
WORKDIR /app

CMD gunicorn --bind 0.0.0.0:80 wsgi:app -w 4 --threads 4
