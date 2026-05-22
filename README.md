# Student Management Information System (MIS)

A full-stack web application for managing student records, administrator login, and dashboard reporting.

## Features

- Administrator login with session-based authentication
- Protected dashboard with live student statistics
- Student record CRUD:
  - Add students
  - Search and filter students
  - Edit student details
  - Delete student records
- MySQL schema and repeatable seed data
- Responsive HTML, CSS, and vanilla JavaScript frontend

## Tech Stack

| Component | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | Express sessions, bcryptjs |

## Project Structure

```text
student-mis/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   ├── schema.sql
│   └── sample-data.sql
├── frontend/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   ├── index.html
│   └── students.html
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 14 or higher
- MySQL 5.7 or higher
- Git

### Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

The default administrator account is:

```text
Username: admin
Password: admin123
```

### Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Update `.env` with your local database credentials before starting the server.

The application is served from `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Log in an administrator |
| POST | `/api/auth/logout` | Log out the current session |
| GET | `/api/auth/me` | Return the authenticated user |
| GET | `/api/students/stats/summary` | Return dashboard student statistics |
| GET | `/api/students` | List students with optional `search` and `status` filters |
| GET | `/api/students/:id` | Get a single student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/health` | Server health check |

## Development

Run a quick backend syntax check:

```bash
cd backend
npm run check
```

## Git Workflow

- `main`: Production-ready code
- `dev`: Development branch
- `feature/*`: Feature branches for specific features

Create focused commits with clear messages, then open a pull request into `dev`.

## License

This project is personal and educational software.
