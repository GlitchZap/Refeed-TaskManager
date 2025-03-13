FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app will run on
EXPOSE 3001

# Start the application in development mode for hot reloading
CMD ["npm", "run", "start:dev"]