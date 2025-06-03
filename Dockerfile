# Use the official Node.js image as the base image
FROM node:23-alpine3.20

# Install Python and make
RUN apk add --no-cache python3 make g++

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the application
CMD ["npm", "run", "start:prod"]