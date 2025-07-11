## URL Shortener Backend

This project is a backend service for shortening URLs, built with Node.js, Express, and MongoDB.

### Features

- Shorten long URLs
- Redirect short URLs to original links
- RESTful API endpoints
- MongoDB for persistent storage

### Getting Started

#### Prerequisites

- Node.js installed
- MongoDB Atlas(used cloud)

#### Installation

```bash
npm init -y
npm install cors express dotenv mongoose
```

```bash
npm express-rate-limit
```

#### Environment Variables

Created a `.env` file and add:

```
PORT=8000
BASE_URL=http://localhost:8000
MONGO_DB_CLOUD_URI=mongodb_connection_string
DB_NAME=UrlShortener
FRONTEND_DEPLOYED_URL=https://urlshortfrontend-8u2m.vercel.app
FRONTEND_LOCAL_URL=http://localhost:5173
```

#### Running the Server

initially used

```bash
node index.js
```

then used nodemon.js for restarting the server automatically

```bash
nodemon index.js
```

# URL Shortener API

This backend provides endpoints for shortening URLs, redirecting, and managing URL data.  
It also includes rate limiting to prevent abuse.

---

## Endpoints

### 1. POST `/shorten`

- **Description:** Shortens a given original URL.
- **Request Body:**
  ```json
  {
    "originalUrl": "https://example.com"
  }
  ```
- **Responses:**
  - `201 Created`: Returns the new shortened URL object.
  - `200 OK`: If the URL was already shortened, returns the existing short URL.
  - `400 Bad Request`: If `originalUrl` is missing.

---

### 2. GET `/:shortId`

- **Description:** Redirects to the original URL using the short ID.
- **Responses:**
  - **Redirects** to the original URL if found and not expired.
  - `404 Not Found`: If the short ID does not exist.
  - `410 Gone`: If the URL has expired.

---

### 3. GET `/api/original/:shortId`

- **Description:** Fetches details about the original URL for a given short ID.
- **Responses:**
  - `200 OK`: Returns URL details (`originalUrl`, `expiryDate`, `clicks`, `createdAt`).
  - `404 Not Found`: If the short ID does not exist.
  - `410 Gone`: If the URL has expired.

---

### 4. GET `/api/urls`

- **Description:** Fetches all shortened URLs with their details.
- **Response:**
  - `200 OK`: Returns an array of URL objects.

---

### 5. DELETE `/api/urls/:shortId`

- **Description:** Deletes a shortened URL by its short ID.
- **Responses:**
  - `200 OK`: If deleted successfully.
  - `404 Not Found`: If the short ID does not exist.

---

## Rate Limiter Usage

This API uses [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) middleware to prevent abuse:

- **Limit:** 100 requests per 30 minutes per IP.
- **Response:** If the limit is exceeded, the API returns:
  ```json
  {
    "message": "Too many requests from this IP, please try again after 15 minutes"
  }
  ```
- **Configuration:**  
  The rate limiter is applied globally to all endpoints in `app.js`:
  ```js
  const rateLimit = require("express-rate-limit");
  const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use(limiter);
  ```

---

## Additional Notes

- Each shortened URL has an expiry date (default: 240 hours from creation).
- Each redirect increments the `clicks` counter.
- All endpoints return JSON except for the redirect endpoint, which issues an HTTP redirect.

---

## Example Usage

```bash
# Shorten a URL
curl -X POST http://localhost:8000/shorten -H "Content-Type: application/json" -d '{"originalUrl":"https://example.com"}'

# Redirect (in browser)
http://localhost:8000/abc123

# Get original URL info
curl http://localhost:8000/api/original/abc123

# Get all URLs
curl http://localhost:8000/api/urls

# Delete a URL
curl -X DELETE http://localhost:8000/api/urls/abc123
```

### License

MIT
