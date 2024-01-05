# Build Stage
FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./

RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

ENTRYPOINT ["npm", "run", "start:dev"]