# ai-code Backend Structure Document

This document outlines the backend architecture, hosting solutions, and infrastructure components for the ai-code project. It is written in everyday language so that anyone can understand the setup, even without a deep technical background.

## 1. Backend Architecture

### Overall Design
- We use a **3-tier architecture**: presentation (API), application (business logic), and data (databases and storage).
- The core backend is implemented as a **microservice** using **Python** and **FastAPI**.
- Each microservice focuses on a single responsibility (for example: authentication, model inference, data management).
- Services communicate over **RESTful HTTP APIs**.

### Supporting Scalability, Maintainability, and Performance
- **Containerization**: Each service runs in a Docker container, ensuring consistent environments and easy scaling.
- **Service Orchestration**: We deploy containers with Kubernetes (EKS) or AWS ECS, allowing automatic scaling up or down based on demand.
- **Separation of Concerns**: By dividing components (authentication, inference, data), it’s easy to update or extend parts without affecting the whole system.
- **Asynchronous Tasks**: Heavy jobs (model training, batch inference) are offloaded to background workers via message queues (RabbitMQ or AWS SQS).

## 2. Database Management

### Technologies Used
- PostgreSQL (SQL) for structured data: user accounts, project metadata, logs.
- MongoDB (NoSQL) for unstructured or semi-structured data: experiment results, model metrics.
- Redis for in-memory caching: session data, rate-limiting counters.

### Data Structure, Storage, and Access
- **Structured data** lives in PostgreSQL. We define tables with clear relationships and use an ORM (SQLAlchemy) to interact with them in Python.
- **Unstructured data** (JSON blobs, large logs) is stored in MongoDB, taking advantage of its flexible schema.
- **Cache layer** (Redis) speeds up frequent reads (for example, retrieving recent inference results).
- **Backup policies**: Automated daily snapshots for PostgreSQL and MongoDB. Incremental backups every hour for critical tables.

## 3. Database Schema

### Human-Readable Overview
- **Users**: store user profiles, authentication details, and roles.
- **Projects**: link to users, hold project settings and status.
- **Models**: track model versions, parameters, storage locations.
- **InferenceRequests**: record each call to the model (input, output, timestamp).
- **Logs**: centralized logs for system events and errors (also duplicated in MongoDB).

### SQL Schema (PostgreSQL)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,       -- e.g., admin, user
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE models (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    version VARCHAR(50) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,  -- S3 or file store location
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inference_requests (
    id SERIAL PRIMARY KEY,
    model_id INTEGER REFERENCES models(id),
    input JSONB NOT NULL,
    output JSONB,
    requested_at TIMESTAMP DEFAULT NOW(),
    duration_ms INTEGER
);

CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,    -- INFO, WARN, ERROR
    message TEXT,
    metadata JSONB,
    logged_at TIMESTAMP DEFAULT NOW()
);
```  

## 4. API Design and Endpoints

### Approach
- We follow **RESTful** design principles: clear, resource-based URLs and standard HTTP methods (GET, POST, PUT, DELETE).
- API Versioning (`/api/v1/`) ensures future updates do not break existing clients.

### Key Endpoints
- **Authentication**
  - `POST /api/v1/auth/signup` : create a new user account
  - `POST /api/v1/auth/login` : authenticate and issue JWT
- **Projects**
  - `GET /api/v1/projects` : list user’s projects
  - `POST /api/v1/projects` : create a new project
  - `GET /api/v1/projects/{id}` : get project details
- **Models**
  - `POST /api/v1/projects/{id}/models` : upload or register a new model
  - `GET /api/v1/projects/{id}/models` : list models for a project
- **Inference**
  - `POST /api/v1/models/{id}/predict` : send input data, receive model predictions
- **Monitoring & Logs**
  - `GET /api/v1/logs` : stream or query application logs

These endpoints allow the front end or other services to manage users, projects, models, and make inference requests.

## 5. Hosting Solutions

### Environment
- **Cloud Provider**: Amazon Web Services (AWS)
- **Compute**: 
  - Containers on **Amazon ECS** or **EKS (Kubernetes)**
  - Fallback: EC2 Auto Scaling Groups with Docker
- **Databases**: 
  - Amazon RDS for PostgreSQL
  - Amazon DocumentDB (MongoDB-compatible) or self-managed MongoDB on EC2
  - Amazon ElastiCache for Redis
- **Storage**: Amazon S3 for model files and large artifacts

### Benefits
- **Reliability**: Managed services (RDS, ElastiCache) come with built-in redundancy and backups.
- **Scalability**: Auto scaling groups and container orchestration handle load spikes automatically.
- **Cost-Effectiveness**: Pay-as-you-go pricing ensures you only pay for the resources you use.

## 6. Infrastructure Components

- **Load Balancer**: AWS Application Load Balancer (ALB) distributes incoming traffic across containers or EC2 instances.
- **Caching**: Redis (ElastiCache) holds session data, rate limits, and temporary results.
- **Content Delivery Network (CDN)**: AWS CloudFront accelerates static asset delivery.
- **Message Queue**: AWS SQS or RabbitMQ manages background tasks (model training, batch inference).
- **Container Registry**: AWS Elastic Container Registry (ECR) stores Docker images.

These pieces work together to optimize response times, distribute traffic evenly, and handle background workloads without blocking real-time requests.

## 7. Security Measures

- **Authentication**: JWT (JSON Web Tokens) with OAuth2 flow. Access tokens are short-lived; refresh tokens allow re-authentication.
- **Authorization**: Role-based access control (RBAC) checks user roles for protected resources.
- **Transport Security**: All traffic over HTTPS (TLS 1.2+). Certificates managed by AWS Certificate Manager.
- **Data Encryption**:
  - **In transit**: TLS for all API calls and database connections.
  - **At rest**: AWS KMS-managed encryption for RDS, S3, and backups.
- **Secrets Management**: AWS Secrets Manager stores database credentials, API keys, and other sensitive information.
- **Rate Limiting and Throttling**: API Gateway or custom middleware to protect against abuse.

## 8. Monitoring and Maintenance

- **Logs & Metrics**:
  - AWS CloudWatch for system metrics (CPU, memory, network) and application logs.
  - Datadog or Prometheus/Grafana for custom dashboards and alerts.
  - Sentry for error tracking and exception monitoring.
- **CI/CD Pipeline**:
  - GitHub Actions or AWS CodePipeline builds Docker images, runs tests, and deploys to staging/production.
- **Maintenance Strategies**:
  - Automated health checks and container restarts on failure.
  - Regular dependency updates and security patching using Dependabot or similar tooling.
  - Monthly disaster-recovery drills to verify backups and restore procedures.

## 9. Conclusion and Overall Backend Summary

In summary, the ai-code backend is built on a flexible, microservice-based design using Python and FastAPI. It relies on managed cloud services (AWS) for compute, databases, and storage to ensure reliability, security, and cost efficiency. Key components like PostgreSQL, MongoDB, Redis, and background queues work together to manage structured data, unstructured logs, caching, and asynchronous workloads. A robust API layer provides clear endpoints for authentication, project management, model registration, and inference.

This structure aligns with the project’s goals by offering a scalable foundation ready to host AI models, handle user interactions, and grow as the ai-code repository evolves from a placeholder to a fully featured AI service platform.