FROM node:10.15-alpine

RUN npm install -g npm

RUN mkdir -p /usr/board-assistant/backend
WORKDIR /usr/board-assistant/backend
COPY ./ ./

RUN npm install

CMD [ "npm", "run", "server" ]
