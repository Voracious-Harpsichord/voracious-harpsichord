FROM        python:3.5

RUN         useradd -m stashmeister

ADD         application /home/stashmeister/application
ADD         data /home/stashmeister/data
ADD         bower.json requirements.txt /home/stashmeister/

WORKDIR     /home/stashmeister
RUN         pip install -q -r requirements.txt

WORKDIR     /home/stashmeister/application

EXPOSE      8080

ENTRYPOINT  ["python3", "-u", "server.py"]
