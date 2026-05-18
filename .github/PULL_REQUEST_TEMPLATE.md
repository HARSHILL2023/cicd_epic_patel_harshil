## 📌 Pull Request Details

### 🏷️ PR Title
`feat(architecture): set up scalable full-stack project skeleton`

---

### 📝 Description
This Pull Request initializes a clean, production-ready, and highly scalable MERN full-stack project skeleton. It establishes a decoupled, enterprise-grade architecture with a clear separation of concerns (MVC) for the Node.js/Express backend and placeholders for the React frontend client.

No business logic, API codes, or implementation files were introduced in this commit, ensuring a clean slate for future feature development.

---

### 📂 Directory & File Architecture

```text
project-root/
├── 📂 frontend/                  # React Frontend client application (kept empty for initialization)
└── 📂 backend/                   # Node.js + Express.js scalable server
    ├── 📂 src/                   # Server source files
    │   ├── 📂 config/            # Database, passport, third-party service connections
    │   ├── 📂 controllers/       # Route controllers (MVC Pattern)
    │   ├── 📂 middleware/        # Custom middleware (auth, rate-limit, logging, error-handling)
    │   ├── 📂 models/            # Mongoose / database schemas
    │   ├── 📂 routes/            # Express route mapping (versioned and decoupled)
    │   ├── 📂 services/          # Pure business logic layer (keeping controllers thin)
    │   ├── 📂 utils/             # Reusable helper functions (loggers, formatters)
    │   ├── 📂 validations/       # Data validation schemas (e.g., Joi or express-validator schemas)
    │   └── 📄 app.js             # Express app setup, middlewares registration
    ├── 📄 server.js              # Network server entry point (port listening, error handlers)
    ├── 📄 .env.example           # Shared environment variable template
    └── 📄 .gitignore             # Targeted Git exclusions for Node server
```

---

### 🚀 Key Improvements & Standards Followed

1. **MVC & Clean Architecture Pattern**: Decoupled HTTP layer (`routes`/`controllers`) from core business logic (`services`), domain blueprints (`models`), utilities (`utils`), and configurations (`config`).
2. **Robust Ignorance & Security Best Practices**: Populated `backend/.gitignore` with industry-standard exclusions to protect secrets, caches, logs, and OS files. Added `.env.example` as a template.
3. **Git Best Practices**: Placed `.gitkeep` placeholder files inside all empty backend directories to ensure they are tracked in version control, maintaining directory structure for all developers clone-wide.
4. **Decoupled Frontend**: Established an isolated `frontend` directory to keep React configurations and styling fully detached from server modules.

---

### 🧪 Verification Checklist
- [x] Folders are named using professional, lower-case/kebab-case industry conventions.
- [x] Backend structure is modular and conforms to standard enterprise-grade Node.js/Express practices.
- [x] Target `.gitignore` prevents unneeded logs, secrets (`.env`), and caches from entering remote source control.
- [x] Directory structure is fully tracked via `.gitkeep` placeholders.
