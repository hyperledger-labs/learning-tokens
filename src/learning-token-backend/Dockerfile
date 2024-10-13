# Image source
FROM node:alpine

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json /app/

# Then install the NPM module
RUN npm install

# Copy current directory to APP folder
COPY . /app/

# Then build
RUN npm run build

EXPOSE 3000
# CMD ["npm", "run", "start:prod"]
CMD ["npm", "run", "start:dev"]
