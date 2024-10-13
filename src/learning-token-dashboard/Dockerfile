# Set the base image
FROM node:16.18-alpine AS builder

# Set the working directory
WORKDIR /app


# Copy the package.json and yarn.lock files to the container
COPY package.json /app

# Install dependencies
RUN yarn

# Copy the rest of the app files to the container
COPY . /app

# # Build the app
# RUN yarn dev

# # Set the base image for the production build
# FROM nginx:alpine

# # Copy the build files to the container
# COPY --from=builder /app/build /usr/share/nginx/html

# # Copy the nginx configuration file to the container
# COPY /client/web-app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 5173

# Start the nginx server
# CMD ["nginx", "-g", "daemon off;"]
CMD ["yarn", "dev"]
