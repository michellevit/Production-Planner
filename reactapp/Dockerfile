FROM node:16-alpine
WORKDIR /reactapp
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build

