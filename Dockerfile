FROM node:22.16.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22.16.0

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY tsconfig*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN apt-get update && apt-get install -y postgresql-client

COPY wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

EXPOSE 3000

CMD ["node", "dist/main"]