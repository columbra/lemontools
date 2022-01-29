FROM node

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . /app
RUN tsc -p tsconfig.json

ENTRYPOINT ["node", "build/index.js"]