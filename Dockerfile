FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

COPY tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build

ENV QS_API_PORT=4011
EXPOSE 4011

VOLUME ["/app/.qs"]

CMD ["node", "dist/server.js"]
