# Dockerfile for AETERNA OmniCore (Node.js Neural Link)
FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8765
EXPOSE 8765

CMD ["npm", "start"]
