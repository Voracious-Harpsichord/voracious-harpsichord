FROM        python:3.5

RUN         DEBIAN_FRONTEND=noninteractive \
            apt-get -qq update && \
            apt-get install sqlite3 && \
            apt-get -qq clean && \
            rm -rf /var/lib/apt/lists/*

RUN         useradd -m stashmeister

ADD         application /home/stashmeister/application
ADD         data /home/stashmeister/data
ADD         bower.json requirements.txt /home/stashmeister/

WORKDIR     /home/stashmeister
RUN         pip install -q -r requirements.txt

WORKDIR     /home/stashmeister/application

EXPOSE      8080

ENTRYPOINT  ["python3", "-u", "server.py"]
