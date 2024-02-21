# Dockerfile
FROM node:18.18.2

# Argument for build-time environment variable
ARG NEXT_PUBLIC_API_HOST

# Set the environment variable from the argument
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Assuming package.json and package-lock.json are in the same directory as the Dockerfile
COPY package*.json ./
RUN npm install

# Bundle app source
# Assuming the source files are in the same directory as the Dockerfile
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
