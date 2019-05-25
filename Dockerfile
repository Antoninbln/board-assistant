FROM node:10.15-alpine

RUN npm install -g npm

RUN mkdir -p /usr/board-assistant/frontend
WORKDIR /usr/board-assistant/frontend
COPY ./ ./
RUN mkdir ./node_modules

RUN npm install
RUN npm build

CMD [ "npm", "run", "client" ]
