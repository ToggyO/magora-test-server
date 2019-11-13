FROM node:12.13.0-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install -g node-gyp
RUN npm install
COPY ./ ./
#EXPOSE 5000
CMD [ "npm", "run", "prod" ]
