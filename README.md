# Wiglud Project: AI-Generated Music Notes

This project is a part of a group assignment for our AI class. The goal is to develop a system that generates music notes using AI. The application runs within Docker containers and provides both a backend for the music generation and a frontend for users to interact with the system.

## Prerequisites

Ensure the following are installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Make](https://www.gnu.org/software/make/)

## Usage

### Option 1: Using Docker Commands

You can manually build and run the containers using Docker commands.

#### 1) Build Docker images (ensure you're in the project root directory):

   ```bash
   docker build -t backend -f dockerfile.backend .
   docker build -t frontend -f dockerfile.frontend .
   ```
#### 2) Run the backend and frontend containers:

   ```bash
   docker run -d -p 3000:3000 -v $(pwd)/generated_music:/app/generated_music -v $(pwd)/backend/data/cache:/app/backend/data/cache --name backend backend
   ```
   ```bash
   docker run -d -p 3001:3001 --name frontend frontend
   ```
   Once the containers are running, you can access the frontend at: http://localhost:3001.
   
#### 3) Clean up containers and images:
To stop and remove both the containers and images, run:

   ```bash
   docker rm -f backend || true
   docker rm -f frontend || true
   docker rmi backend || true
   docker rmi frontend || true
   ```
   
### Option 2: Using Makefile
If you prefer to use the provided Makefile, you can streamline the process.

### 1) Build the Docker images:
   ``` bash
   make build
   ```
   
### 2) Run the Docker containers:
   ``` bash
   make run
   ```

### 3) Clean up:
   ``` bash
   make clean
   ```