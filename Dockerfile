FROM node:18.12.1 as server

WORKDIR /app/server

COPY server/package.json /app/server

RUN npm install

COPY server /app/server

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
