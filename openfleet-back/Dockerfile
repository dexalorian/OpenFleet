# Use an official Node.js runtime as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on (adjust if needed)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
