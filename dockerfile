# Base image with Python 3.8 and TensorFlow support
FROM tensorflow/tensorflow:latest

# Set the working directory in the container to /ai
WORKDIR /app/ai

# Copy the 'ai' directory from the host to the container
COPY ai/ /app/ai

# Install the required Python packages
RUN pip install --no-cache-dir numpy music21 keras

# Run the Python script
CMD ["python", "interface.py"]
