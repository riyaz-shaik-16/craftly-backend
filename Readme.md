# Craftly — Backend API

Node.js/Express REST API for the Craftly portfolio generation platform. Handles authentication, portfolio management, AI resume parsing, Handlebars template rendering, and deployment to AWS S3.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Architecture Overview](#architecture-overview)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose |
| Authentication | JWT + bcryptjs |
| AI Parsing | Google Gemini API |
| Template Engine | Handlebars.js |
| Static Hosting | AWS S3 |
| File Uploads | Multer |
| Image Storage | Cloudinary |
| Security | Helmet, express-rate-limit, CORS |
| Dev | Nodemon |

---

## Project Structure

```
src/
├── config/
│   ├── db.js                  # MongoDB connection
│   └── cloudinary.js          # Cloudinary config
├── controllers/
│   ├── auth.controller.js     # Register, login
│   ├── dashboard.controller.js
│   ├── portfolio.controller.js # CRUD + deploy
│   └── preview.controller.js  # Template preview
├── middlewares/
│   ├── auth.middleware.js     # JWT verification
│   ├── error.middleware.js    # Global error handler
│   └── multer.middleware.js   # PDF/file upload config
├── models/
│   ├── user.model.js
│   └── portfolio.model.js
├── routes/
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── portfolio.routes.js
│   └── preview.routes.js
├── services/
│   ├── gemini.js              # Gemini API resume parsing
│   └── template.service.js   # Handlebars render + S3 upload
├── utils/
│   ├── jwt.js                 # Token sign/verify helpers
│   ├── normalizeUrl.js
│   └── uploadToCloudinary.js
├── app.js                     # Express app setup
└── server.js                  # Entry point
templates/                     # Handlebars .hbs template files (9 themes)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- AWS S3 bucket with static website hosting enabled
- Google Gemini API key
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/craftly-backend.git
cd craftly-backend

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env .env.local
```

### Running locally

```bash
npm run dev
```

Server starts on `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?appName=Cluster0

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_long_random_secret_string
JWT_EXPIRES_IN=1d

# CORS origins
CLIENT_URL1=http://localhost:5173
CLIENT_URL2=https://your-domain.com

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# AWS S3
AWS_REGION=eu-north-1
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET=your-s3-bucket-name
```

> **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## API Reference

All protected routes require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ✗ | Register a new user |
| POST | `/api/auth/login` | ✗ | Login and receive JWT |

**POST** `/api/auth/register`
```json
{
  "name": "Riyaz",
  "email": "riyaz@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "riyaz@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "Riyaz", "email": "..." }
}
```

---

### Portfolio

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/portfolio` | ✓ | Get current user's portfolio |
| POST | `/api/portfolio` | ✓ | Create a new portfolio |
| PUT | `/api/portfolio/:id` | ✓ | Update portfolio |
| DELETE | `/api/portfolio/:id` | ✓ | Delete portfolio |
| POST | `/api/portfolio/:id/deploy` | ✓ | Render template and deploy to S3 |

**Deploy flow** (`POST /api/portfolio/:id/deploy`):
1. Fetches portfolio document from MongoDB
2. Compiles the selected Handlebars template with portfolio data
3. Uploads rendered `index.html` to S3 at `username/index.html`
4. Updates `deployed: true` in the portfolio document
5. Returns the live URL (`https://username.craftly.live`)

---

### Resume Parsing

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/resume/parse` | ✓ | Upload PDF, parse with Gemini AI |

**Request:** `multipart/form-data` with field `resume` (PDF file)

**Response:** Structured JSON matching the portfolio schema:
```json
{
  "name": "...",
  "title": "...",
  "summary": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "skills": ["..."],
  "experience": [{ "company": "...", "role": "...", "duration": "..." }],
  "education": [{ "institution": "...", "degree": "...", "year": "..." }],
  "projects": [{ "name": "...", "description": "...", "link": "..." }],
  "certifications": ["..."],
  "achievements": ["..."],
  "socialLinks": { "github": "...", "linkedin": "..." }
}
```

---

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | ✓ | Get dashboard summary |

---

### Preview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/preview/:template` | ✓ | Preview a rendered template |

Available templates: `ai`, `corporate`, `creative`, `dark`, `luxury`, `modern`, `narrative`, `resume`, `saas`, `terminal`

---

## Architecture Overview

```
Browser
  │
  ▼
React Frontend (craftly.live)
  │  REST API + JWT
  ▼
Express Backend (api.craftly.live)
  ├── MongoDB          ← user and portfolio data
  ├── Gemini API       ← PDF resume parsing
  ├── Cloudinary       ← image uploads
  └── AWS S3           ← deploy rendered HTML
        │
        ▼
  Cloudflare Worker    ← routes username.craftly.live → S3
```

---

## Deployment

The backend is deployed on **Amazon EC2** using **Docker** and **Nginx** as a reverse proxy.

### Docker

```bash
# Build the image
docker build -t craftly-backend .

# Run the container
docker run -d \
  --name craftly-backend \
  -p 5000:5000 \
  --env-file .env \
  craftly-backend
```

### Nginx config (reverse proxy)

```nginx
server {
    listen 80;
    server_name api.craftly.live;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### GitHub Actions (CI/CD)

Automated deployment is configured via `.github/workflows/deploy.yml`. On push to `main`, the workflow SSHs into the EC2 instance, pulls the latest code, rebuilds the Docker image, and restarts the container.

---

## Notes

- This backend uses **ES Modules** (`"type": "module"` in package.json). Use `import/export` syntax throughout — `require()` is not supported.
- Multer is configured to handle `multipart/form-data` for PDF uploads. File size limits and allowed MIME types are defined in `src/middlewares/multer.middleware.js`.
- The `templates/` directory contains 9 Handlebars `.hbs` files. Each template receives the same portfolio data object, ensuring any template can be swapped without schema changes.
- Rate limiting via `express-rate-limit` is applied globally to prevent abuse of the AI parsing endpoint.