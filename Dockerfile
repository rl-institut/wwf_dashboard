FROM python:3.8.0-slim

RUN apt-get update && \
    apt-get install -y \
        build-essential \
        make \
        gcc \
        libffi6 libffi-dev libcairo2-dev \
ca-certificates \
fonts-liberation \
libappindicator3-1 \
libasound2 \
libatk-bridge2.0-0 \
libatk1.0-0 \
libc6 \
libcairo2 \
libcups2 \
libdbus-1-3 \
libexpat1 \
libfontconfig1 \
libgbm1 \
libgcc1 \
libglib2.0-0 \
libgtk-3-0 \
libnspr4 \
libnss3 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libstdc++6 \
libx11-6 \
libx11-xcb1 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxrandr2 \
libxrender1 \
libxss1 \
libxtst6 \
lsb-release \
wget \
xdg-utils

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt 

RUN apt-get remove -y --purge make gcc build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY ./ /app
COPY ./static/fonts /usr/share/fonts
WORKDIR /app

CMD gunicorn --bind 0.0.0.0:80 wsgi:app -w 4 --threads 4
