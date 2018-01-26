FROM node:9.4.0

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN npm install --production

EXPOSE 80

CMD ["npm", "start"]
