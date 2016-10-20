FROM node
COPY package.json /graphql/
COPY ./dist/* /graphql/dist/
COPY ./dist/gen-nodejs /graphql/dist/gen-nodejs
WORKDIR /graphql
RUN NODE_ENV=production
RUN npm i
ENTRYPOINT npm start
