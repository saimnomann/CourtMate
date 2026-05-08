
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
