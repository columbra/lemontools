FROM node:18.1

# Copy package.json and yarn.lock only
COPY yarn.lock package.json ./

# Copy Environment Variables

COPY .env.dev .env.prod .env.shared ./

# Install dependencies
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN yarn --prod
RUN yarn add typescript

# Copy rest of the files
COPY . .

RUN yarn run tsc -p tsconfig.json

# Copy assets
RUN mkdir -p build/asset
RUN cp -r src/asset/**/* build/asset

# Environment variables

ENV MODE=prod

CMD [ "node", "." ]