<<<<<<< HEAD
# CRUDMessenger 
This project is just to leran concepts about NestJS and back-end generally. This is my frist time in back-end
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is a simple project to learn about [Nest](https://github.com/nestjs/nest) framework TypeScript. My goal with this poject is learn about back-end generally, and some specific topics I’m interested: tests, Swagger, JWT, Docker, cloud (in special Google Cloud Plataform) and and delve into database.

## Project Goal
This project was born as a hands-on learning experience — a simple CRUD system with a real-world twist: sending messages to friends and family. More than just a code exercise, it’s a full-stack playground designed to sharpen backend and DevOps skills. <br>

Users can create, view, edit, and delete, messages and their account an in a clean, secure environment. Under the hood, the app features JWT-based authentication, API documentation via Swagger, and is fully containerized with Docker. The project is also test-driven with Jest (in progress), and will be deployed on Google Cloud Platform (GCP) upon completion. <br>

It’s not just about building an app — it’s about mastering the workflow behind modern web development. <br>

## Used In This Project
- [TypeScript](https://www.typescriptlang.org/) - A statically typed superset of JavaScript used to improve code quality, readability, and maintainability.
- [Node](https://nodejs.org/en) - JavaScript runtime used to build the server-side logic of the application.
- [Nest](https://nestjs.com/) -  A progressive Node.js framework used to structure the application using modular, scalable architecture and TypeScript decorators.
- [TypeORM](https://typeorm.io/) - ORM used for data modeling, migrations, and communication with the PostgreSQL database.
- [PostgreSQL](https://www.postgresql.org/) - A robust open-source relational database used to store and manage user and message data.
- [JWT](https://jwt.io/) - Used for API documentation, allowing developers to test and understand the available endpoints.
- [Swagger](https://swagger.io/) - Testing framework used to write and run unit tests, ensuring code reliability and preventing regressions.
- [Jest](https://jestjs.io/) - Testing framework used to write and run unit tests, ensuring code reliability and preventing regressions.
- [Docker](https://www.docker.com/) - Containerization platform used to standardize the development environment and prepare the app for production deployment.
- [GCP](https://cloud.google.com/) - Target cloud provider for deploying the application, taking advantage of scalable infrastructure and cloud services.

Others tools
- [Insomnia](https://insomnia.rest/download) - API client used for testing and debugging HTTP requests during development, especially useful for validating endpoints and authentication flows.
- [DBeaver](https://dbeaver.io/) - Database management tool used to visualize, query, and manage the PostgreSQL database efficiently through a GUI.


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

  <p align="center">Links of NestJS team</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
>>>>>>> master
