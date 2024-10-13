# Define variables
BACKEND_IMAGE_NAME = backend
BACKEEND_CONTAINER_NAME = backend

FRONTEND_IMAGE_NAME = frontend
FRONTEND_CONTAINER_NAME = frontend

APP_DIR = /app/generated_music
CACHE_DIR = /app/backend/data/cache

BACKEEND_DOCKERFILE = dockerfile.backend
FRONTEND_DOCKERFILE = dockerfile.frontend

# Target to build the Docker image
build:
	docker build -t $(BACKEND_IMAGE_NAME) -f $(BACKEEND_DOCKERFILE) .
	docker build -t $(FRONTEND_IMAGE_NAME) -f $(FRONTEND_DOCKERFILE) .

# Target to run the Docker container

run:
	docker run -d -p 3000:3000 -v $(shell pwd)/generated_music:$(APP_DIR) -v $(shell pwd)/backend/data/cache:$(CACHE_DIR) --name $(BACKEEND_CONTAINER_NAME) $(BACKEND_IMAGE_NAME)
	docker run -d -p 3001:3001 --name $(FRONTEND_CONTAINER_NAME) $(FRONTEND_IMAGE_NAME)

run_dev:
	docker run -d -p 3001:3001 --name $(FRONTEND_CONTAINER_NAME) $(FRONTEND_IMAGE_NAME)
	docker run -p 3000:3000 -v $(shell pwd)/generated_music:$(APP_DIR) -v $(shell pwd)/backend/data/cache:$(CACHE_DIR) --name $(BACKEEND_CONTAINER_NAME) $(BACKEND_IMAGE_NAME)

compose	:
	docker-compose up

# Target to build and run the Docker container
all: build run

# Target to stop and remove the container
clean:
	docker rm -f $(BACKEEND_CONTAINER_NAME) || true
	docker rm -f $(FRONTEND_CONTAINER_NAME) || true
	docker rmi $(BACKEND_IMAGE_NAME) || true
	docker rmi $(FRONTEND_IMAGE_NAME) || true
