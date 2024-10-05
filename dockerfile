FROM node:20

# Update and install Python
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Create a virtual environment for Python
RUN python3 -m venv /opt/venv

# Upgrade pip in the virtual environment
RUN /opt/venv/bin/pip install --upgrade pip \
&& /opt/venv/bin/pip install numpy music21 keras tensorflow

# Create app directory
WORKDIR /app/backend

# Setup Node.js
COPY /backend/package*.json ./
RUN npm install

COPY /backend .

# Expose the port your app runs on
EXPOSE 3000

# Setup Python
WORKDIR /app/ai
COPY /ai /app/ai/

WORKDIR /app/generated_music
COPY /generated_music /app/generated_music/

# Start the Node.js application
WORKDIR /app/backend
CMD ["npm", "start"]
