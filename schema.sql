
CREATE DATABASE Courtmate;

USE Courtmate;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Coach', 'Athlete') NOT NULL DEFAULT 'Athlete',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(100) NOT NULL,
    court_type VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Maintenance', 'Inactive') NOT NULL DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);