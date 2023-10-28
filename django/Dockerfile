FROM python:3.11.1
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y default-libmysqlclient-dev
WORKDIR /django
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

