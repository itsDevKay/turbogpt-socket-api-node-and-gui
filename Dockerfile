FROM ubuntu:22.04

# Disable Prompt During Packages Installation
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update -y
RUN apt-get install -y git vim python3-pip
RUN pip3 install python-socketio[client] simple-websocket 
RUN git clone https://github.com/itsDevKay/turbogpt-socket-api-node-and-gui
RUN python3 -m pip install -r /turbogpt-socket-api-node-and-gui/src/loopgpt-docker-container/requirements.txt
ENV PYTHONPATH "${PYTHONPATH}:/turbogpt-socket-api-node-and-gui/src/loopgpt-docker-container/src"

CMD ["/turbogpt-socket-api-node-and-gui/src/loopgpt-docker-container/src/loopgpt/run_cli_socket.py"]
ENTRYPOINT ["/usr/bin/python3"]