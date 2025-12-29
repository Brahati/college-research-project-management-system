const db = require("../config/db");

/* ===============================
   COMPANY → CREATE PROJECT
================================ */
exports.createProject = (req, res) => {
  const companyUserId = req.user.user_id;
  const { title, description, department } = req.body;
  const team_size = Number(req.body.team_size);

  if (!title || !description || !department || !team_size) {
    return res.status(400).json({ message: "All fields required" });
  }

  const companySql = `
    SELECT company_id FROM companies WHERE user_id = ?
  `;

  db.query(companySql, [companyUserId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (rows.length === 0) return res.status(404).json({ message: "Company not found" });

    const companyId = rows[0].company_id;

    const insertSql = `
      INSERT INTO projects
      (title, description, department, team_size, company_id, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
    `;

    db.query(insertSql, [title, description, department, team_size, companyId], (err) => {
      if (err) return res.status(500).json({ message: "Project creation failed" });
      res.json({ message: "Project submitted for admin approval" });
    });
  });
};

/* ===============================
   COMPANY → VIEW OWN PROJECTS
================================ */
exports.getMyProjects = (req, res) => {
  const companyUserId = req.user.user_id;

  const sql = `
    SELECT project_id, title, department, team_size, status
    FROM projects
    WHERE company_id = (
      SELECT company_id FROM companies WHERE user_id = ?
    )
  `;

  db.query(sql, [companyUserId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch projects" });
    res.json(results);
  });
};

/* ===============================
   PROJECT UPDATES (FACULTY + COMPANY)
================================ */
exports.addProjectUpdate = (req, res) => {
  const { project_id, message } = req.body;
  const sender_role = req.user.role;

  if (!project_id || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    INSERT INTO project_updates (project_id, sender_role, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [project_id, sender_role, message], (err) => {
    if (err) return res.status(500).json({ message: "Failed to add update" });
    res.json({ message: "Update posted successfully" });
  });
};

exports.getProjectUpdates = (req, res) => {
  const { projectId } = req.params;

  const sql = `
    SELECT sender_role, message, created_at
    FROM project_updates
    WHERE project_id = ?
    ORDER BY created_at ASC
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch updates" });
    res.json(results);
  });
};
