
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
ALTER TABLE Courts
ADD CONSTRAINT chk_hourly_rate_positive
CHECK (hourly_rate > 0);

CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    court_id INT NOT NULL,

    booking_date DATE NOT NULL,

    start_time TIME NOT NULL,

    duration_hours INT NOT NULL,

    total_amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'Pending',
        'Confirmed',
        'Cancelled'
    ) DEFAULT 'Confirmed',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_booking_court
    FOREIGN KEY (court_id)
    REFERENCES courts(id)
    ON DELETE CASCADE
);

ALTER TABLE Bookings
ADD CONSTRAINT chk_duration_hours_positive
CHECK (duration_hours > 0);

ALTER Table Bookings
ADD CONSTRAINT chk_total_amount_positive
CHECK (total_amount > 0);

CREATE TABLE training_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    coach_id INT NOT NULL,
    court_id INT NOT NULL,

    title VARCHAR(100) NOT NULL,
    description TEXT,

    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_hours INT NOT NULL,

    max_athletes INT NOT NULL,
    status ENUM('Active', 'Cancelled', 'Completed') DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_coach
    FOREIGN KEY (coach_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_session_court
    FOREIGN KEY (court_id)
    REFERENCES courts(id)
    ON DELETE CASCADE,

    CONSTRAINT chk_session_duration
    CHECK (duration_hours > 0),

    CONSTRAINT chk_max_athletes
    CHECK (max_athletes > 0)
);

CREATE TABLE session_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    session_id INT NOT NULL,
    athlete_id INT NOT NULL,

    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_enrollment_session
    FOREIGN KEY (session_id)
    REFERENCES training_sessions(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_enrollment_athlete
    FOREIGN KEY (athlete_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT unique_session_athlete
    UNIQUE (session_id, athlete_id)
);