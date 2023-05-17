# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app
RUN npm run build

# Expose the container's port (change it to match the port used by your Angular app)
EXPOSE 80

# Start the Angular app when the container launches
CMD ["npm", "run", "start"]
