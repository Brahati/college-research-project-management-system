const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// STUDENT REPORT
router.get("/student", verifyToken, (req, res) => {
  const studentId = req.user.user_id;

  const sql = `
    SELECT *
    FROM student_application_report
    WHERE student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch report" });
    }
    res.json(results);
  });
});

module.exports = router;
