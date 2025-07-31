# Petstore API Tests

This repository contains automated API tests for the [Swagger Petstore API](https://petstore.swagger.io/).

## Overview

These tests use:
- [Playwright Test](https://playwright.dev/docs/test-api-testing) for running HTTP requests.
- TypeScript for type safety.
- Environment variables for secure configuration (API key and base URL).

The tests cover:
- Adding a new pet (`POST /pet`)
- Retrieving an existing pet by ID (`GET /pet/{petId}`)
- Updating an existing pet (`PUT /pet`)

### API Information for Reviewers
The tests are written against the public **Swagger Petstore** API:
- **Base URL:** `https://petstore.swagger.io/v2`
- **API Documentation:** [Swagger Petstore](https://petstore.swagger.io/)

The API is public and does not require real authentication, but an `api_key` header is included as required by the specification.

## Prerequisites

- [Node.js](https://nodejs.org/) (>= 16)
- [npm](https://www.npmjs.com/)
- [Playwright](https://playwright.dev/)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/cvdw85/petstore-api-tests
   cd petstore-api-tests

2. Install dependencies:
   npm install

3. Set up environment variables:
   cp .env.example .env
   Then edit .env as needed.

## Running tests:

1. Execute test command:
   npx playwright test --reporter=list

2. Security note:
   The Api key is not provided in this project.
   Ask another Dev to provide it to you.
