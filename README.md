# Task 1 — Automate Code Deployment Using CI/CD Pipeline

## Project Overview

This project implements a Continuous Integration and Continuous Delivery (CI/CD) pipeline using GitHub Actions, Node.js, and Docker.

Whenever code is pushed to the `main` branch, GitHub Actions automatically runs the application's tests, builds a Docker image, and publishes the image to Docker Hub.

## Objectives

- Develop a Node.js web application.
- Write an automated integration test.
- Containerize the application using Docker.
- Automate testing and image publishing with GitHub Actions.
- Store Docker Hub credentials securely using GitHub Actions secrets.

## Technologies Used

- **Node.js 24** — Application runtime
- **Node.js Test Runner** — Automated testing
- **Git and GitHub** — Version control and source code hosting
- **GitHub Actions** — CI/CD automation
- **Docker** — Application containerization
- **Docker Hub** — Docker image registry
- **Ubuntu on WSL 2** — Local development environment

## Project Structure

```text
task-1-cicd-demo/
├── .github/
│   └── workflows/
│       └── main.yml
├── test/
│   └── app.test.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── app.js
├── package.json
└── README.md
```

## Application

The application uses Node.js's built-in HTTP module to serve a JSON response on port 3000.

Example response:

```json
{
  "message": "Task 1 CI/CD Demo is running!",
  "status": "success"
}
```

## CI/CD Workflow

The GitHub Actions workflow is located at `.github/workflows/main.yml`.

The pipeline is triggered by:
- A push to the `main` branch
- A manual trigger using `workflow_dispatch`

### Pipeline stages

1. **Checkout:** Download the repository source code.
2. **Set up Node.js:** Configure Node.js 24 on the GitHub-hosted runner.
3. **Test:** Run `npm test` and verify the application response.
4. **Set up Docker Buildx:** Prepare the Docker image build environment.
5. **Authenticate:** Log in to Docker Hub using GitHub repository secrets.
6. **Build and push:** Build the Docker image and publish it to Docker Hub.

The image publishing job depends on the test job. If the tests fail, the image publishing job will not run.

### Published image tags

The workflow publishes two tags:

- `latest` — The latest successfully published image.
- `sha-<commit>` — An image tagged with the full Git commit SHA.

## Security

The Docker Hub credentials are stored as GitHub Actions repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

The credentials are referenced by the workflow and are not hardcoded into the application or Dockerfile.

The Docker container runs as a non-root user.

## Run Locally

### Prerequisites

Install Node.js 24 and Docker.

### Run the application

```bash
npm start
```

In another terminal, test the endpoint:

```bash
curl -i http://localhost:3000
```

Stop the application with `Ctrl + C`.

### Run automated tests

```bash
npm test
```

### Build the Docker image

```bash
docker build -t task-1-cicd-demo:1.0.0 .
```

### Run the Docker container

```bash
docker run -d \
  --name task-1-cicd-container \
  -p 3000:3000 \
  task-1-cicd-demo:1.0.0
```

Verify the response:

```bash
curl -i http://localhost:3000
```

Stop and remove the container:

```bash
docker rm -f task-1-cicd-container
```

## Pull the Published Image

The published image is available at:

https://hub.docker.com/r/hemanthreddy0824/task-1-cicd-demo

Pull the latest image:

```bash
docker pull hemanthreddy0824/task-1-cicd-demo:latest
```

Run it locally:

```bash
docker run -d \
  --name task-1-cicd-verify \
  -p 3000:3000 \
  hemanthreddy0824/task-1-cicd-demo:latest
```

Test it:

```bash
curl -i http://localhost:3000
```

Clean up:

```bash
docker rm -f task-1-cicd-verify
```

## Verification Results

The following checks were completed successfully:

- Node.js application returned HTTP 200 OK.
- Automated application test passed locally.
- Docker image built successfully.
- GitHub Actions test job passed.
- GitHub Actions Docker build-and-push job passed.
- Both `latest` and commit-specific Docker Hub tags were published.
- The published Docker image was pulled and run locally.
- The containerized application returned the expected JSON response.

## Project Links

- **GitHub Repository:** https://github.com/hemanthreddy0824/task-1-cicd-demo
- **Docker Hub Repository:** https://hub.docker.com/r/hemanthreddy0824/task-1-cicd-demo
- **GitHub Actions:** https://github.com/hemanthreddy0824/task-1-cicd-demo/actions

## Conclusion

This project demonstrates an automated CI/CD pipeline for a Node.js application using GitHub Actions and Docker. The pipeline validates the application through automated testing, builds a container image, and publishes the image to Docker Hub, making it available for subsequent deployment.
