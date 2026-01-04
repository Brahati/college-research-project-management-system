const db = require("../config/db");

/**
 * ===============================
 * STUDENT → VIEW AVAILABLE PROJECTS
 * (ONLY projects with faculty assigned)
 * ===============================
 */
exports.viewProjects = (req, res) => {
  const sql = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.department,
      p.team_size,
      c.company_name,
      u.name AS faculty_name
    FROM projects p
    JOIN companies c ON p.company_id = c.company_id
    JOIN users u ON p.faculty_id = u.user_id
    WHERE p.status = 'APPROVED'
      AND p.faculty_id IS NOT NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching student projects:", err);
      return res
        .status(500)
        .json({ message: "Failed to load projects" });
    }

    res.json(results);
  });
};

/**
 * ===============================
 * STUDENT → APPLY TO PROJECT
 * ===============================
 */
exports.applyProject = (req, res) => {
  const { project_id, statement_of_interest } = req.body;
  const student_id = req.user.user_id;

  if (!project_id || !statement_of_interest) {
    return res
      .status(400)
      .json({ message: "Project ID and statement required" });
  }

  if (!student_id) {
    return res
      .status(400)
      .json({ message: "Student ID missing in token" });
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
        return res
          .status(500)
          .json({ message: "Failed to apply to project" });
      }

      res.json({
        message: "Application submitted successfully",
      });
    }
  );
};

/**
 * ===============================
 * STUDENT → VIEW MY APPLICATIONS
 * ===============================
 */
exports.getMyApplications = (req, res) => {
  const student_id = req.user.user_id;

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
      console.error("Error fetching applications:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch applications" });
    }

    res.json(results);
  });
};
