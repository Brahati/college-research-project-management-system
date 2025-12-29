const { sendEmail } = require("../utils/emailService");
const db = require("../config/db");

exports.viewApplications = (req, res) => {
  const facultyId = req.user.user_id;
  const { project_id } = req.body;
  const sql = `
    SELECT pa.application_id, u.name AS student,
           p.title, pa.statement_of_interest, pa.status
    FROM project_applications pa
    JOIN users u ON pa.student_id = u.user_id
    JOIN projects p ON pa.project_id = p.project_id
    WHERE pa.project_id = ?
    AND p.faculty_id = ?
  `;
  db.query(sql, [projectId, facultyId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.updateApplication = (req, res) => {
  const { application_id, status } = req.body;

  if (!application_id || !status) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const sql = `
    SELECT u.email, p.title
    FROM project_applications pa
    JOIN users u ON pa.student_id = u.user_id
    JOIN projects p ON pa.project_id = p.project_id
    WHERE pa.application_id = ?
  `;

  db.query(sql, [application_id], (err, result) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const studentEmail = result[0].email;
    const projectTitle = result[0].title;

    db.query(
      "UPDATE project_applications SET status=? WHERE application_id=?",
      [status, application_id],
      async (err) => {
        if (err) {
          console.error("Update error:", err);
          return res.status(500).json({ message: "Update failed" });
        }

        // Email must NEVER crash backend
        try {
          await sendEmail(
            studentEmail,
            `Project Application ${status}`,
            `Your application for "${projectTitle}" has been ${status}.`
          );
        } catch (emailErr) {
          console.error("Email failed:", emailErr.message);
        }

        res.json({ message: "Application updated successfully" });
      }
    );
  });
};

exports.getAvailableProjects = (req, res) => {
  console.log("Faculty dept from JWT:", JSON.stringify(req.user.department));

  const facultyDept = req.user.department;

  const sql = `
    SELECT p.project_id, p.title, p.description, c.company_name
    FROM projects p
    JOIN companies c ON p.company_id = c.company_id
    WHERE p.status = 'APPROVED'
      AND p.faculty_id IS NULL
      AND p.department = ?
  `;

  db.query(sql, [facultyDept], (err, results) => {
    if (err)  {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
    res.json(results);
  });
};

exports.undertakeProject = (req, res) => {
  const facultyId = req.user.user_id;
  const { project_id } = req.body;

  if (!project_id) {
    return res.status(400).json({ message: "project_id required" });
  }

  const sql = `
    UPDATE projects
    SET faculty_id = ?
    WHERE project_id = ?
      AND faculty_id IS NULL
  `;

  db.query(sql, [facultyId, project_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to undertake project" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Project already undertaken"
      });
    }

    res.json({ message: "Project successfully undertaken" });
  });
};

exports.getMyProjects = (req, res) => {
  const facultyId = req.user.user_id;

  const sql = `
    SELECT p.project_id,
           p.title,
           p.description,
           c.company_name,
           p.status
    FROM projects p
    JOIN companies c ON p.company_id = c.company_id
    WHERE p.faculty_id = ?
  `;

  db.query(sql, [facultyId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
    res.json(results);
  });
};

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

exports.getApplicationsForProject = (req, res) => {
  const facultyId = req.user.user_id
  const { projectId } = req.params;
  const sql = `
    SELECT pa.application_id,
        u.name AS student,
        u.email,
        pa.status,
        pa.statement_of_interest
    FROM project_applications pa
    JOIN users u ON pa.student_id = u.user_id
    JOIN projects p ON pa.project_id = p.project_id
    WHERE pa.project_id = ?
    AND p.faculty_id = ?
  `;

  db.query(sql, [projectId,facultyId], (err, results) => {
    if (err){
      console.error("CRITICAL DB ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch applications" });
    }
    res.json(results);
  
  });
};
