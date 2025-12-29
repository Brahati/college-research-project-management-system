-- ADMIN
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@college.edu', 'admin123', 'ADMIN');

-- FACULTY
INSERT INTO users (name, email, password, role, department)
VALUES
('Dr. Rao', 'rao@college.edu', 'pass123', 'FACULTY', 'CSE'),
('Dr. Mehta', 'mehta@college.edu', 'pass123', 'FACULTY', 'ISE');

-- STUDENTS
INSERT INTO users (name, email, password, role, department)
VALUES
('Ananya', 'ananya@college.edu', 'pass123', 'STUDENT', 'CSE'),
('Rohan', 'rohan@college.edu', 'pass123', 'STUDENT', 'ISE');

-- COMPANY USER
INSERT INTO users (name, email, password, role)
VALUES ('TechCorp HR', 'hr@techcorp.com', 'pass123', 'COMPANY');

-- COMPANY DETAILS
INSERT INTO companies (user_id, company_name, description)
VALUES (5, 'TechCorp', 'AI and Data Science Company');

-- PROJECT
INSERT INTO projects (
    title, description, department, company_id, team_size, status
)
VALUES (
    'AI-Based Student Analytics',
    'Predict student performance using ML',
    'CSE',
    1,
    3,
    'APPROVED'
);
