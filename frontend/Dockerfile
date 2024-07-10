FROM node:lts AS build

WORKDIR /app

COPY package.json ./

RUN yarn install --frozen-lockfile 

COPY . .

ARG NEXT_PUBLIC_APP_API_URI

ENV NEXT_PUBLIC_APP_API_URI=${NEXT_PUBLIC_APP_API_URI}

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
