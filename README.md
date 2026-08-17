# Castle Wellness — Backend API

Node/Express + MongoDB + Cloudinary backend for the Castle Wellness spa website and admin panel.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - MongoDB Atlas connection string
   - A random `JWT_SECRET`
   - Cloudinary credentials (cloud name, API key, API secret)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — first admin login
3. Create the first admin user:
   ```
   node utils/seedAdmin.js
   ```
4. Run the server:
   ```
   npm run dev
   ```
   Server starts on `http://localhost:5000`

## API Overview

### Auth
- `POST /api/auth/login` — `{ email, password }` → returns JWT
- `GET /api/auth/me` — protected, returns logged-in admin

### Services (massages/therapies)
- `GET /api/services` — public, active only
- `GET /api/admin/services` — protected, all
- `POST /api/admin/services` — protected, multipart form with `image` field
- `PUT /api/admin/services/:id` — protected, multipart form
- `DELETE /api/admin/services/:id` — protected

### Packages
- `GET /api/packages` — public, active only
- `GET /api/admin/packages` — protected, all
- `POST /api/admin/packages` — protected
- `PUT /api/admin/packages/:id` — protected
- `DELETE /api/admin/packages/:id` — protected

### Gallery
- `GET /api/gallery` — public, active only
- `GET /api/admin/gallery` — protected, all
- `POST /api/admin/gallery` — protected, multipart form with `image` field
- `PUT /api/admin/gallery/:id` — protected
- `DELETE /api/admin/gallery/:id` — protected

All protected routes need header: `Authorization: Bearer <token>`

## Notes
- Images go straight to Cloudinary via `multer-storage-cloudinary` — no local disk storage, so there's no conflict between upload libraries.
- Rate limiting is applied only to `/api/auth/login` using the library's default key generator (avoids the IPv6 key-gen crash).
- `express-mongo-sanitize` + `hpp` are applied globally for basic injection/parameter-pollution protection.
