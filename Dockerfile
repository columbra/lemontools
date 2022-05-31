FROM node:18.1

# Copy package.json and yarn.lock only
COPY yarn.lock package.json ./

# Copy Environment Variables

COPY .env.dev .env.prod .env.shared ./

# Install dependencies
RUN yarn --prod
RUN yarn add typescript

# Copy rest of the files
COPY . .

RUN yarn run tsc -p tsconfig.json

# Environment variables

ENV MODE=prod

CMD [ "node", "." ]