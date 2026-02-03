const db = require("../config/db");

/* ---------------- STUDENT REPORT ---------------- */
exports.studentReport = (req, res) => {
  const sql = "SELECT * FROM student_application_report";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/* ---------------- FACULTY REPORT ---------------- */
exports.facultyReport = (req, res) => {
  const sql = "SELECT * FROM faculty_project_report";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/* ---------------- COMPANY REPORT ---------------- */
exports.companyReport = (req, res) => {
  const sql = "SELECT * FROM company_project_report";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/* ---------------- ADMIN REPORT ---------------- */
exports.adminReport = (req, res) => {
  const sql = "SELECT * FROM admin_overall_report";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
