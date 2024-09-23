# Wiglud Project

This project uses Docker to run the application. You can easily build and run the Docker container using a Makefile. Below are the instructions on how to use it.

## Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Make](https://www.gnu.org/software/make/)

## Usage

### Building the Docker Image

To build the Docker image, run:

```bash
make build
```

### Running the Docker Container

To run the Docker container, execute:

```bash
make run
```

### Clenning up

To stop and remove the Docker container, run:

```bash
make clean
```