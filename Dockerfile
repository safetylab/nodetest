FROM node:16
WORKDIR /usr/src/app
COPY index.js ./
COPY package.json ./
RUN npm install
ENV TEST_HOST '0.0.0.0'
ENV TEST_PORT 3001
CMD [ "node", "index.js"]
