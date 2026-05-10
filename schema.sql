
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



CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,

    equipment_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,

    total_quantity INT NOT NULL,
    available_quantity INT NOT NULL,

    rental_price DECIMAL(10,2) NOT NULL,

    status ENUM('Available', 'Unavailable') DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_total_quantity
    CHECK (total_quantity > 0),

    CONSTRAINT chk_available_quantity
    CHECK (available_quantity >= 0),

    CONSTRAINT chk_rental_price
    CHECK (rental_price >= 0)
);

CREATE TABLE equipment_rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,

    athlete_id INT NOT NULL,
    equipment_id INT NOT NULL,

    quantity INT NOT NULL,

    rental_date DATE NOT NULL,
    return_date DATE,

    total_amount DECIMAL(10,2) NOT NULL,

    status ENUM('Rented', 'Returned') DEFAULT 'Rented',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rental_athlete
    FOREIGN KEY (athlete_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_rental_equipment
    FOREIGN KEY (equipment_id)
    REFERENCES equipment(id)
    ON DELETE CASCADE,

    CONSTRAINT chk_rental_quantity
    CHECK (quantity > 0)
);

CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    payment_type ENUM('Court Booking', 'Equipment Rental', 'Training Session') NOT NULL,

    reference_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    status ENUM('Pending', 'Paid', 'Cancelled') DEFAULT 'Pending',

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT chk_payment_amount
    CHECK (amount >= 0)
);
