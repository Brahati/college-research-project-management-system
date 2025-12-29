const { sendEmail } = require("../utils/emailService");
const db = require("../config/db");

// 🔹 Get all pending projects
exports.getPendingProjects = (req, res) => {
  const sql = `
    SELECT 
      p.project_id,
      p.title,
      p.description,
      p.department,
      c.company_name
    FROM projects p
    LEFT JOIN companies c ON p.company_id = c.company_id
    WHERE p.status = 'PENDING'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("FETCH PENDING PROJECTS ERROR:", err);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
    res.json(results);
  });
};

// 🔹 Approve / Reject project + email company
exports.updateProjectStatus = (req, res) => {
  const project_id = Number(req.body.project_id);
  const status = String(req.body.status).trim().toUpperCase();

  if (!project_id || !["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // 1️⃣ Fetch company email via users table
  const fetchSql = `
    SELECT p.title, u.email
    FROM projects p
    JOIN companies c ON p.company_id = c.company_id
    JOIN users u ON c.user_id = u.user_id
    WHERE p.project_id = ?
  `;

  db.query(fetchSql, [project_id], (err, rows) => {
    if (err || rows.length === 0) {
      console.error(err);
      return res.status(404).json({ message: "Project not found" });
    }

    const projectTitle = rows[0].title;
    const companyEmail = rows[0].email;

    // 2️⃣ Update project status ONLY if pending
    const updateSql = `
      UPDATE projects
      SET status = ?
      WHERE project_id = ?
        AND status = 'PENDING'
    `;

    db.query(updateSql, [status, project_id], async (err, result) => {
      if (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({ message: "Update failed" });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({
          message: "Project already processed or not pending"
        });
      }

      // 3️⃣ Send email to company
      await sendEmail(
        companyEmail,
        `Project ${status}`,
        `Your project "${projectTitle}" has been ${status} by the admin.`
      );

      res.json({ message: `Project ${status} and company notified` });
    });
  });
};

exports.getAdminStats = (req, res) => {
  const queries = {
    statusStats: `
      SELECT status, COUNT(*) AS count
      FROM projects
      GROUP BY status
    `,
    departmentStats: `
      SELECT department, COUNT(*) AS count
      FROM projects
      WHERE status = 'APPROVED'
      GROUP BY department
    `
  };

  db.query(queries.statusStats, (err, statusResult) => {
    if (err) return res.status(500).json(err);

    db.query(queries.departmentStats, (err, deptResult) => {
      if (err) return res.status(500).json(err);

      res.json({
        statusStats: statusResult,
        departmentStats: deptResult
      });
    });
  });
};

