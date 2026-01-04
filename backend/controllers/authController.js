const db = require("../config/db");
const jwt = require("jsonwebtoken");

/* ================= LOGIN ================= */
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        department: user.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user_id: user.user_id,
      name: user.name, // for faculty/student/admin
    });
  });
};

/* ================= GET LOGGED-IN USER ================= */
exports.getMe = (req, res) => {
  const user = req.user;

  // NON-COMPANY USERS → return name directly
  if (user.role !== "COMPANY") {
    return res.json({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      name: user.name,
    });
  }

  // COMPANY USER → fetch company name
  const sql = `
    SELECT company_name
    FROM companies
    WHERE user_id = ?
  `;

  db.query(sql, [user.user_id], (err, rows) => {
    if (err) {
      console.error("GET ME ERROR:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch company profile" });
    }

    res.json({
      user_id: user.user_id,
      role: user.role,
      email: user.email,
      company_name: rows[0]?.company_name || "Company",
    });
  });
};
