FROM        python:3.5

RUN         DEBIAN_FRONTEND=noninteractive \
            apt-get -qq update && \
            apt-get -qq install libpq-dev nodejs npm && \
            apt-get -qq clean && \
            rm -rf /var/lib/apt/lists/*

RUN         ln -s /usr/bin/nodejs /usr/bin/node
RUN         npm install -g bower

RUN         useradd -m stashmeister

ADD         application /home/stashmeister/application
ADD         data /home/stashmeister/data
ADD         .bowerrc bower.json data-loader.py requirements.txt /home/stashmeister/

WORKDIR     /home/stashmeister
RUN         pip install -q -r requirements.txt
RUN         bower --allow-root install
WORKDIR     /home/stashmeister/application

EXPOSE      8080

USER        stashmeister
ENTRYPOINT  ["python3", "server.py"]
