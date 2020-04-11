# Base the image off of the NodeJS image
FROM node

# Set the working directory
WORKDIR /root

# Source file and then the destination
COPY ./ /root
COPY package*.json ./

RUN npm install

COPY ./server ./server
CMD [ "node", "server/index.js" ]
EXPOSE 8080 3000