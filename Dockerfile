# Use the official Node.js image (version 16, Alpine Linux for a smaller size)
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files (if they exist)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set an environment variable, like the port (if your app needs it)
ENV PORT=3000

# Tell Docker that the container listens on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
