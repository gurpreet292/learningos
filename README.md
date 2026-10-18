# LearningOS

A premium MERN learning platform for HTML, CSS, and JavaScript fundamentals.

## Project structure

- `client/` – Vite React frontend with Tailwind design system
- `server/` – Express.js API with MongoDB models and JWT auth

## Quick start

Copy `server/.env.example` to `server/.env` and set a unique `JWT_SECRET` and a reachable `MONGO_URI`. For local development, the example uses MongoDB on `127.0.0.1:27017`. Optionally set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to seed an admin account; use a unique, strong password. No default admin account is created.

Copy `client/.env.example` to `client/.env` if the API is not available at `http://localhost:5000/api`.

Install dependencies from the project root with `npm install`, then run both services with `npm run dev`.

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Accounts

Use the registration flow to create a student account. An admin account is created during database seeding only when both `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `server/.env`.

## Features

- JWT auth and protected routes
- Course and lesson browsing
- Quizzes and progress tracking
- Downloadable certificate-ready flow
- Responsive dashboard UI
- Admin course management

## Environment

The backend reads configuration from `server/.env`. Never commit `.env` files or use development credentials in production. Configure `MONGO_URI`, a unique `JWT_SECRET`, and `NODE_ENV=production` in your deployment environment.
