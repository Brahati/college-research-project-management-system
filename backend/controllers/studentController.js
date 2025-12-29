const db = require("../config/db");

exports.viewProjects = (req, res) => {
  const sql = `
    SELECT p.project_id, p.title, p.description, p.department,
           p.team_size, c.company_name
    FROM projects p
    JOIN companies c ON p.company_id = c.company_id
    WHERE p.status = 'APPROVED'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/*
exports.applyProject = (req, res) => {
  const { project_id, statement } = req.body;
  const student_id = req.user.user_id;

  const sql = `
    INSERT INTO project_applications
    (project_id, student_id, statement_of_interest)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [project_id, student_id, statement], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Application submitted" });
  });
};
*/
exports.applyProject = (req, res) => {
    const { project_id, statement_of_interest } = req.body;

    console.log("REQ.USER:", req.user);
    console.log("PROJECT ID:", project_id);
    console.log("STATEMENT:", statement_of_interest);

    const student_id = req.user.user_id; // we will verify this

    if (!student_id) {
      return res.status(400).json({ message: "Student ID missing in token" });
    }

  const sql = `
    INSERT INTO project_applications
    (project_id, student_id, statement_of_interest, status)
    VALUES (?, ?, ?, 'PENDING')
  `;

  db.query(
    sql,
    [project_id, student_id, statement_of_interest],
    (err, result) => {
      if (err) {
        console.error("DB INSERT ERROR:", err);
        return res.status(500).json({ message: "Failed to apply" });
      }

      console.log("INSERT RESULT:", result);
      res.json({ message: "Application submitted successfully" });
    }
  );
};

// controllers/studentController.js

exports.getMyApplications = (req, res) => {
  const student_id = req.user.user_id || req.user.id;

  const sql = `
    SELECT 
      pa.application_id,
      p.title AS project_title,
      pa.status,
      pa.statement_of_interest
    FROM project_applications pa
    JOIN projects p ON pa.project_id = p.project_id
    WHERE pa.student_id = ?
    ORDER BY pa.application_id DESC
  `;

  db.query(sql, [student_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch applications" });
    }
    res.json(results);
  });
};



