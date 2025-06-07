# CRUDMessenger 
> Full-stack NestJS app for messaging, built to explore backend development, testing, DevOps and cloud deployment.

![Project Status](https://img.shields.io/badge/project-active--development-yellow)
![Made with NestJS](https://img.shields.io/badge/made%20with-NestJS-red)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)


## Description
This project was developed as part of my journey into backend development. It explores core technologies such as NestJS, Docker, JWT, and aims to simulate a real-world API system. My goal with this project is to learn backend development in general, along with specific topics I'm particularly interested in: testing, Swagger, JWT, Docker, cloud deployment (especially with Google Cloud Platform), and database design.

## 🎯 Project Goal
This project was born as a hands-on learning experience — simple CRUD system with a real-world twist: simulating a basic messaging platform between users. More than just a code exercise, it’s a full-stack playground designed to sharpen backend and DevOps skills.

Users can create, view, edit, and delete, messages and their account in a clean, secure environment. Under the hood, the app features JWT-based authentication, API documentation with Swagger, and is fully containerized with Docker. The project is also tested with Jest, and will be deployed on Google Cloud Platform (GCP) upon completion. 

It’s not just about building an app — it’s about mastering the workflow behind modern web development. 

## 👨‍💻 Used In This Project
| Technology       | Description |
|------------------|-------------|
| **TypeScript**   | A statically typed superset of JavaScript. |
| **NestJS**       | A Node.js framework with a modular architecture. |
| **TypeORM**      | ORM for relational databases with migration support. |
| **PostgreSQL**   | A robust, open-source relational database. |
| **JWT**          | Token-based authentication system. |
| **Swagger**      | Automatic API documentation generator. |
| **Docker**       | Containerization platform for consistent environments. |
| **Jest**         | Testing framework for unit and e2e tests. |
| **Insomnia**     | HTTP client for testing API endpoints. |
| **DBeaver**      | GUI for database management and queries. |
| **GCP**          | Cloud provider used for deploying and scaling the application infrastructure. |

## 🛣 Roadmap

- [x] JWT authentication
- [x] CRUD for messages and users
- [x] Swagger documentation
- [X] Tests: unit and e2e
- [x] Docker containerization
- [x] CI/CD pipeline with GitHub Actions
- [ ] Deploy to Google Cloud Run
- [ ] Frontend with React+Next.js



## 🐋 Running the Project with Docker
This project is fully containerized using Docker and Docker Compose, ensuring easy setup and consistent environments.

Requirements:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Clone the repository
```bash
git clone https://github.com/Fabricio-Antonio/Nest-first-time.git
cd Nest-first-time
```

Create the ```.env``` file <br>
Create a ```.env``` file in the root directory with the following content:

```env
# PostgreSQL
DB_HOST=db
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```
```DB_HOST``` must be set to db, which is the service name defined in docker-compose.yml.

Build and run the containers
```bash
docker-compose up --build
```

This will:
- Start the PostgreSQL service (defined in `docker-compose.yml`) on port **5432**
- Launch the NestJS backend server on port **3000**

Access the application
API Base URL: http://localhost:3000

Swagger UI: http://localhost:3000/docs

Stopping the containers
To gracefully shut down the containers:

```bash
docker-compose down
```

## 🧪 Test Environment Setup
Before running any test scripts, you must configure a .env.test file with the following structure:

```bash
process.env.NODE_ENV =
process.env.DB_HOST =
process.env.DB_PORT =
process.env.DB_USERNAME =
process.env.DB_PASSWORD =
process.env.DB_DATABASE =
process.env.JWT_SECRET =
process.env.JWT_TOKEN_AUDIENCE =
process.env.JWT_TOKEN_ISSUER =
process.env.JWT_TTL =
process.env.JWT_REFRESH_TTL =
```
Once the .env.test file is set up, you're ready to run the tests.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#### API Testing with Insomnia

You can test all endpoints easily using [Insomnia](https://insomnia.rest/).

> 📥 Download the full request collection:
> [insomnia_collection.yaml](./docs/Insomnia_2025-06-03.yaml)

To import:
1. Open Insomnia
2. Click on **"Create > Import"**
3. Choose **"From File"** and select the yaml you downloaded
4. Done! All routes will be available

## 🧭 Swagger Interface - Route Documentation
Below is a visual reference of the available API endpoints, automatically documented using Swagger. This interface allows developers to explore the structure, parameters, and responses of each route in a clean and interactive format.

The documentation includes:

- Authentication flow (Login, Register)
- Message management (Create, Read, Update, Delete)
- User-related operations
- Request/response examples with schemas

<details>
  <summary>Click to expand Swagger screenshots</summary>


![Screenshot from 2025-05-30 12-28-41](https://github.com/user-attachments/assets/6c33b6b1-fcb7-46be-91f1-75d543d251fc)
![Screenshot from 2025-05-30 12-29-19](https://github.com/user-attachments/assets/21c73c67-359c-419d-bfe0-99f2893eadc2)
![Screenshot from 2025-05-30 12-29-33](https://github.com/user-attachments/assets/f2e5f7e6-5675-4947-b6a5-91395d8ca8bc)
![Screenshot from 2025-05-30 12-30-07](https://github.com/user-attachments/assets/6af8c59c-9b8b-4fa6-9ac4-78520d88b32a)
![Screenshot from 2025-05-30 12-30-22](https://github.com/user-attachments/assets/e6bb3887-2a6a-48e8-a708-250d9f4cb6e3)

</details>

## 🧠 Key Learnings

Throughout this project, I deepened my understanding of:

- Building scalable APIs using NestJS and modular architecture
- Implementing secure authentication flows with JWT
- Documenting APIs using Swagger for clear dev collaboration
- Containerizing environments using Docker and Docker Compose
- Planning cloud deployment workflows (Google Cloud Platform)
- Writing unit and e2e tests using Jest and testing best practices
- Structuring and migrating relational databases using TypeORM



## 👥 Stay in touch

- Author - [Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/)
- Website - [www.fabriciosantos.dev.br](https://www.fabriciosantos.dev.br)
- Youtube - [@DevFabricioSantos](https://www.youtube.com/@DevFabricioSantos)

## 📜 License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

### 🤝 Want to contribute?
This project is open to contributions! Feel free to fork, open an issue, or submit a PR.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
