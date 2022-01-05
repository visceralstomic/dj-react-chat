FROM node:alpine

WORKDIR /app/app_frontend
ENV PATH /app/app_frontend/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN npm i
RUN chown -R node.node /app/app_frontend

EXPOSE 3000
CMD ["npm", "start"]

