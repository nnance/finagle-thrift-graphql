FROM node
COPY package.json /graphql/
COPY ./dist/ /graphql/dist/
WORKDIR /graphql
RUN npm install --production
CMD node ./dist/server.js
