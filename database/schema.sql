-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'FACULTY', 'ADMIN', 'COMPANY') NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- COMPANIES TABLE
-- =========================
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =========================
-- PROJECTS TABLE
-- =========================
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    company_id INT,
    faculty_id INT,
    team_size INT DEFAULT 1,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ONGOING', 'COMPLETED') DEFAULT 'PENDING',
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (faculty_id) REFERENCES users(user_id)
);

-- =========================
-- PROJECT APPLICATIONS
-- =========================
CREATE TABLE project_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    student_id INT,
    statement_of_interest TEXT,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
);

-- =========================
-- MEETINGS TABLE
-- =========================
CREATE TABLE meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    faculty_id INT,
    meeting_datetime DATETIME,
    agenda TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (faculty_id) REFERENCES users(user_id)
);

-- =========================
-- PROJECT PROGRESS UPDATES
-- =========================
CREATE TABLE project_updates (
    update_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    updated_by INT,
    progress_percent INT CHECK (progress_percent BETWEEN 0 AND 100),
    remarks TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- =========================
-- NOTIFICATIONS TABLE
-- =========================
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    type ENUM('EMAIL', 'SYSTEM') DEFAULT 'EMAIL',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
