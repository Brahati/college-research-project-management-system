/* =========================================
   STUDENT REPORT
========================================= */

DROP VIEW IF EXISTS student_application_report;

CREATE VIEW student_application_report AS
SELECT
    s.user_id AS student_id,
    s.name AS student_name,
    p.project_id,
    p.title AS project_title,
    c.company_name,
    f.name AS faculty_name,
    pa.status AS application_status,
    pa.statement_of_interest,
    pa.applied_at AS applied_on
FROM project_applications pa
JOIN users s ON pa.student_id = s.user_id
JOIN projects p ON pa.project_id = p.project_id
JOIN companies c ON p.company_id = c.company_id
LEFT JOIN users f ON p.faculty_id = f.user_id;


/* =========================================
   FACULTY REPORT
========================================= */

DROP VIEW IF EXISTS faculty_project_report;

CREATE VIEW faculty_project_report AS
SELECT
    f.user_id AS faculty_id,
    f.name AS faculty_name,
    p.project_id,
    p.title AS project_title,
    c.company_name,
    COUNT(pa.application_id) AS total_applications,
    SUM(pa.status = 'ACCEPTED') AS accepted_count,
    SUM(pa.status = 'REJECTED') AS rejected_count,
    SUM(pa.status = 'PENDING') AS pending_count
FROM projects p
JOIN users f ON p.faculty_id = f.user_id
JOIN companies c ON p.company_id = c.company_id
LEFT JOIN project_applications pa ON p.project_id = pa.project_id
GROUP BY p.project_id;


/* =========================================
   COMPANY REPORT
========================================= */

DROP VIEW IF EXISTS company_project_report;

CREATE VIEW company_project_report AS
SELECT
    c.company_id,
    c.company_name,
    p.project_id,
    p.title,
    p.department,
    p.team_size,
    p.status AS project_status,
    f.name AS faculty_name,
    COUNT(pa.application_id) AS total_applications
FROM projects p
JOIN companies c ON p.company_id = c.company_id
LEFT JOIN users f ON p.faculty_id = f.user_id
LEFT JOIN project_applications pa ON p.project_id = pa.project_id
GROUP BY p.project_id;


/* =========================================
   ADMIN REPORTS
========================================= */

DROP VIEW IF EXISTS admin_project_overview;

CREATE VIEW admin_project_overview AS
SELECT
    p.project_id,
    p.title,
    p.department,
    p.status,
    c.company_name,
    f.name AS faculty_name,
    COUNT(pa.application_id) AS applications
FROM projects p
JOIN companies c ON p.company_id = c.company_id
LEFT JOIN users f ON p.faculty_id = f.user_id
LEFT JOIN project_applications pa ON p.project_id = pa.project_id
GROUP BY p.project_id;


DROP VIEW IF EXISTS admin_user_summary;

CREATE VIEW admin_user_summary AS
SELECT
    role,
    COUNT(*) AS total_users
FROM users
GROUP BY role;
