FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json worker.js ./

USER node
CMD ["node", "worker.js"]