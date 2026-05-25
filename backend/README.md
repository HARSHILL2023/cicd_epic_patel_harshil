# CI/CD & Infrastructure Knowledge API

A robust, enterprise-grade REST API for serving the CI/CD and Infrastructure Knowledge dataset. Built with Node.js, Express, and MongoDB.

## Features
- **MVC Architecture**: Clean separation of routes, controllers, and models.
- **Advanced Querying**: Pagination, sorting, regex keyword search, and multi-field filtering.
- **Aggregations**: Get real-time statistics (topic distribution, difficulty metrics, latest records).
- **Authentication**: JWT-based authentication with Role-Based Access Control (Admin/User).
- **Security**: Helmet, rate limiting, and CORS enabled.
- **Data Protection**: Soft-delete system prevents accidental permanent data loss.
- **Health Monitoring**: Real-time server and database uptime metrics.

---

## 🚀 Setup Instructions

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend/` directory. You can use `.env.example` as a template.
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=30d
   CORS_ORIGIN=*
   ```

3. **Seed Database**
   Import the `dataset.json` file into your MongoDB instance:
   ```bash
   npm run seed
   # To clear existing data and re-seed, use:
   # npm run seed -- --reset
   ```

4. **Run the Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/          # DB Connection
│   ├── controllers/     # API Logic (Auth, Knowledge, Health)
│   ├── middleware/      # Auth, Error, Role, Rate Limits, Logging
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express Routers
│   ├── scripts/         # Backup & Seeder scripts
│   ├── utils/           # Pagination & Response Formatters
│   └── validations/     # Express-validator schemas
├── .env                 # Environment variables
├── dataset.json         # Source dataset
├── package.json         # NPM scripts & dependencies
└── server.js            # Entry Point
```

---

## 🌐 API Routes

### Health Monitoring
- `GET /api/v1/health` - Simple API ping
- `GET /api/v1/health/system` - Server memory & uptime
- `GET /api/v1/health/database` - MongoDB connection status

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Authenticate & get token
- `GET /api/v1/auth/profile` - Get logged-in profile

### Knowledge Dataset (Public)
- `GET /api/v1/knowledge` - Get paginated records (Supports `?search=X`, `?difficulty=Y`, `?topic=Z`)
- `GET /api/v1/knowledge/:id` - Get single record
- `GET /api/v1/knowledge/stats/overview` - Get aggregation statistics

### Knowledge Dataset (Protected - Admin Only)
- `POST /api/v1/knowledge` - Create record
- `PUT /api/v1/knowledge/:id` - Update record
- `DELETE /api/v1/knowledge/:id` - Soft delete record

*(For detailed Request Body and Response examples, refer to the Postman API Reference)*
