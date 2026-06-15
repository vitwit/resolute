FROM node:lts AS build
LABEL maintainer="support@vitwit.com"
WORKDIR /client
COPY package.json yarn.lock ./
COPY . .
RUN yarn 
RUN yarn build

## 
FROM nginx:latest
COPY --from=build /client/build /usr/share/nginx/html