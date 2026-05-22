# Student Management Information System (MIS)

> A modern, full-stack web application for managing student records and information.

## 📋 Project Description

Student MIS is a comprehensive student management system designed for educational institutions. It provides a simple yet powerful platform for managing student information, including authentication, dashboard, and complete CRUD operations for student records.

## ✨ Features

- **User Authentication**: Secure login system with session management
- **Dashboard**: Main hub displaying quick statistics and actions
- **Student Management**:
  - Add new student records
  - View all students in a dedicated page
  - Edit student information
  - Delete student records
- **Responsive UI**: Clean and intuitive user interface
- **Session Management**: Secure session handling with logout functionality

## 🛠 Tech Stack

| Component    | Technology                      |
| ------------ | ------------------------------- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend**  | Node.js, Express.js             |
| **Database** | MySQL                           |
| **Server**   | Express.js Server               |

## 📦 Project Structure

```
student-mis/
├── frontend/               # Frontend files (HTML, CSS, JS)
│   ├── assets/            # Images and media
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── index.html         # Login page
│   ├── dashboard.html     # Dashboard page
│   └── students.html      # Student management page
├── backend/               # Backend server files
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json       # Node.js dependencies
├── database/              # Database related files
│   ├── schema.sql         # Database schema
│   └── sample-data.sql    # Sample data
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Git

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd student-mis
```

#### 2. Setup Database

```bash
# Create MySQL database
mysql -u root -p < database/schema.sql

# (Optional) Add sample data
mysql -u root -p < database/sample-data.sql
```

#### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (update with your database credentials)
# Configure database connection, port, etc.

# Start the server
npm start
```

Server will run at `http://localhost:3000`

#### 4. Access Frontend

```bash
# Open frontend in browser
open frontend/index.html
# OR
# Use a local server like Live Server extension in VS Code
```

## 📝 Usage

1. **Login**: Navigate to `index.html` and log in with administrator credentials
2. **Dashboard**: View quick stats and navigate to student management
3. **Manage Students**: Add, view, edit, or delete student records
4. **Logout**: Click logout to end your session

## 🔐 Security Features

- Password hashing for secure storage
- Session-based authentication
- Input validation and sanitization
- CSRF protection ready
- SQL injection prevention through prepared statements

## 🗄 Database Schema

The system uses the following main tables:

- **users**: Stores login credentials for administrators
- **students**: Stores student information (name, email, roll number, etc.)

## 🔄 Git Workflow

This project follows a professional Git workflow:

- `main`: Production-ready code
- `dev`: Development branch
- `feature/*`: Feature branches for specific features

### Creating a Feature Branch

```bash
git checkout dev
git checkout -b feature/feature-name
```

### Merging a Feature Branch

```bash
git checkout dev
git merge feature/feature-name
```

## 👨‍💻 Development

This project is built step by step with clear separation of concerns:

1. **Feature/Login-System** - Authentication logic
2. **Feature/Dashboard** - Main dashboard page
3. **Feature/Student-CRUD** - Student management operations

## 📄 API Endpoints

(Documentation will be added after backend implementation)

## 🤝 Contributing

For development:

1. Create a feature branch from `dev`
2. Make your changes
3. Commit with clear messages
4. Create a pull request to `dev`
5. After review, merge to `dev`
6. When stable, merge `dev` to `main`

## 📄 License

This project is personal/educational software.

## 👤 Author

Developer - Student Management System Project

---

**Note**: This is an educational project demonstrating full-stack development practices with a professional Git workflow.
