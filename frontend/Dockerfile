FROM node:lts AS build

WORKDIR /app

COPY package.json ./

RUN yarn install --frozen-lockfile 

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
