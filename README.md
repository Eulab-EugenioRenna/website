# EULAB Modern Portfolio

A premium, animated portfolio website for EULAB, built with Angular, TailwindCSS, and PocketBase.

## Features

- **Liquid Glass Design:** Modern transparency and blur effects.
- **GSAP Animations:** Smooth, timeline-based animations.
- **Dynamic Content:** Backend managed via PocketBase (Projects, Partners, Clients).
- **Dockerized:** Full stack orchestration with Docker Compose.

## Prerequisites

- Docker Desktop installed and running.

## Quick Start

1. **Start the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the sites:**
   - **Frontend:** [http://localhost:4200](http://localhost:4200)
   - **Backend Admin:** [http://localhost:8090/_/](http://localhost:8090/_/)

3. **First Run Setup:**
   - Go to the Backend Admin URL.
   - Create your first Admin account.
   - The collections (`projects`, `partners`, `clients`) are automatically created for you by the migration script.
   - Start adding your content!

## Project Structure

- `frontend/`: Angular application (v18+).
- `backend/`: PocketBase configuration (Dockerfile + Migrations).
- `docker-compose.yml`: Services orchestration.

## Tech Stack

- **Frontend:** Angular, TailwindCSS v4, GSAP
- **Backend:** PocketBase using Go/JS
- **Containerization:** Docker, Alpine Linux, Nginx
