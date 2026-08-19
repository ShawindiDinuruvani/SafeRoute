# SafeRoute – Public Transport Safety and Incident Reporting Platform

SafeRoute is a full-stack application designed to help public transport users report safety incidents, view verified reports on a map, and identify high-risk routes.

## Features
- **Public Map**: View verified incidents on an interactive map.
- **Reporting**: Authenticated users can report incidents.
- **Moderator Portal**: Review, verify, and reject user submissions.
- **Transport Authority Portal**: View verified incidents, analyze risk, and record corrective actions.
- **Admin Dashboard & User Management**: Full system oversight and staff account creation.
- **Role-Based Access Control**: Secure JWT-based authentication.

## Technology Stack
- **Backend**: Java 21, Spring Boot 3, Spring Security, JWT, PostgreSQL/H2, Flyway.
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, React-Leaflet, Recharts.

## Prerequisites
- Java 21
- Node.js 18+
- Maven
- PostgreSQL (For Production Profile)

## Environments & Profiles

The application is structured with separate **Development** and **Production** profiles to ensure sensitive data and demo accounts are not exposed in a live environment.

### 1. Development Profile (`dev`) - Default
The development profile runs with an **in-memory H2 database** and seeds the database with demo users, roles, categories, and sample incidents for easy local testing.

**How to run (Backend):**
Navigate to the `backend` directory and run:
```bash
mvn spring-boot:run
```
*(By default, Spring Boot uses the `dev` profile if `SPRING_PROFILES_ACTIVE` is not set).*

**Development Accounts (Seeded in `dev` only):**
- **Admin Account**: `admin@saferoute.com` / `Admin123!` (Role: `ROLE_ADMIN` -> `/admin/dashboard`)
- **Moderator Account**: `moderator@saferoute.com` / `Moderator123!` (Role: `ROLE_MODERATOR` -> `/moderator/dashboard`)
- **Transport Authority Account**: `authority@saferoute.com` / `Authority123!` (Role: `ROLE_TRANSPORT_AUTHORITY` -> `/authority/dashboard`)
- **Standard User Account**: `user@saferoute.com` / `User123!` (Role: `ROLE_USER` -> `/dashboard`)

### 2. Production Profile (`prod`)
The production profile connects to a **PostgreSQL database** and strictly requires environment variables for credentials and security keys. It **does not** seed demo users or sample incidents. It only initializes the required database schema, roles, and incident categories.

**Environment Variables Required:**
See `backend/.env.example` for details. You must provide:
- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL` (e.g., `jdbc:postgresql://localhost:5432/saferoute`)
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET` (A strong, Base64 encoded secret key)

**How to run (Backend):**
```bash
# Set your environment variables first, then run:
mvn spring-boot:run -Dspring-boot.run.profiles=prod
# OR using a packaged JAR:
java -jar -Dspring.profiles.active=prod target/saferoute-backend-0.0.1-SNAPSHOT.jar
```

## Running the Frontend

Navigate to the `frontend` directory. 
If needed, create a `.env` file based on `frontend/.env.example` to override the default API URL.

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm run dev
```
The web app will be available at `http://localhost:5173`.

**Build for production:**
```bash
npm run build
```
This generates a static bundle in the `dist/` directory that can be served using any static file server (e.g., Nginx, Apache).
