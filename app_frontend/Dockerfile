FROM node:alpine

WORKDIR /app/frontend
COPY package.json package-lock.json ./
RUN npm ci 
COPY . ./
EXPOSE 3000
