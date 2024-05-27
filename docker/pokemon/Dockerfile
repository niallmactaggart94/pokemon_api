FROM node:20-alpine as base

ARG NPM_TOKEN

LABEL maintainer=""
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]

COPY .  /pokemon_api
WORKDIR /pokemon_api

RUN rm -rf Makefile *.md docker *.yml *.txt \
    .dockerignore .git*

# Install node packages
RUN npm install
RUN npm run build

COPY docker/pokemon/entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]

RUN apk add curl
RUN apk add dumb-init

CMD ["dumb-init", "node", "/pokemon_api/build/index.js"]
