-- Student MIS Database Schema
-- Execute this file with: mysql -u root -p < schema.sql

-- Create Database
CREATE DATABASE IF NOT EXISTS student_mis;
USE student_mis;

-- Users Table (for login/authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_number VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50),
  postal_code VARCHAR(10),
  enrollment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_roll_number (roll_number),
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- Insert Default Admin User
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@studentmis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1gW0cANUt4XaVjt4VK8kVGwOLBpP3pO', 'Administrator', 'admin');
-- Note: Password is bcrypt hashed. Plain text is "admin123"

-- Insert Sample Students
INSERT INTO students (roll_number, first_name, last_name, email, phone, date_of_birth, gender, enrollment_date) VALUES
('STU001', 'John', 'Doe', 'john.doe@student.com', '9876543210', '2005-05-15', 'M', '2023-08-01'),
('STU002', 'Jane', 'Smith', 'jane.smith@student.com', '9876543211', '2004-07-20', 'F', '2023-08-01'),
('STU003', 'Michael', 'Johnson', 'michael.j@student.com', '9876543212', '2005-03-10', 'M', '2023-08-01');
