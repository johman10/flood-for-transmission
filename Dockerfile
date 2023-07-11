FROM linuxserver/transmission:latest

ARG VERSION=$(date\ +'%Y-%m-%dT%H:%M:%S')
LABEL build_version="Flood for transmission - version ${VERSION}"
LABEL maintainer="johman10"

# Remove content of existing folder in transmission image
RUN rm -rf flood-for-transmission/* 2>/dev/null && mkdir -p flood-for-transmission

COPY public flood-for-transmission

ENV TRANSMISSION_WEB_HOME=/flood-for-transmission
