# Base image with Node.js
FROM node:20

# Update and install Python, FluidSynth, and ffmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    fluidsynth \
    ffmpeg

# Create a Python virtual environment and install Python dependencies
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install numpy music21 keras tensorflow pydub midi2audio

# Set PATH to use the virtual environment by default
ENV PATH="/opt/venv/bin:$PATH"

# Copy your project files to the Docker container
WORKDIR /app

# Copy Node.js backend files and install Node.js dependencies
COPY /backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY /backend ./

# Copy Python AI-related files and the SoundFont file in /ai
WORKDIR /app/ai
COPY /ai .

# Copy generated_music folder
WORKDIR /app/generated_music
COPY /generated_music .

# Expose the port your Node.js app uses
EXPOSE 3000

# Command to start the Node.js application
WORKDIR /app/backend
CMD ["npm", "start"]
