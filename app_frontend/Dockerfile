FROM node:alpine

WORKDIR /app/app_frontend
ENV PATH /app/app_frontend/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN npm i

EXPOSE 3000
CMD ["npm", "start"]

