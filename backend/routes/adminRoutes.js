const express = require("express");
const router = express.Router();

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const {
  getPendingProjects,
  updateProjectStatus,
  getAdminStats
} = require("../controllers/adminController");

router.get(
  "/stats",
  verifyToken,
  allowRoles("ADMIN"),
  getAdminStats
);


// 🔹 View pending projects
router.get(
  "/projects/pending",
  verifyToken,
  allowRoles("ADMIN"),
  getPendingProjects
);

// 🔹 Approve / Reject project
router.post(
  "/projects/status",
  verifyToken,
  allowRoles("ADMIN"),
  updateProjectStatus
);

module.exports = router;
