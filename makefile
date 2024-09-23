# Define variables
IMAGE_NAME = wiglud
CONTAINER_NAME = wiglud
APP_DIR = /app/ai

# Target to build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Target to run the Docker container
run:
	docker run -p 3000:3000 -v $(shell pwd)/ai:$(APP_DIR) --name $(CONTAINER_NAME) $(IMAGE_NAME)

# Target to build and run the Docker container
all: build run

# Target to stop and remove the container
clean:
	docker rm -f $(CONTAINER_NAME) || true
