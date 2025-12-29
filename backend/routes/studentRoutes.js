const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const {
  viewProjects,
  applyProject
} = require("../controllers/studentController");
const {
  getMyApplications
} = require("../controllers/studentController");



router.get(
  "/projects",
  verifyToken,
  allowRoles("STUDENT"),
  viewProjects
);

router.post(
  "/apply",
  verifyToken,
  allowRoles("STUDENT"),
  applyProject
);

// routes/studentRoutes.js
router.get(
  "/applications",
  verifyToken,
  allowRoles("STUDENT"),
  getMyApplications
);



module.exports = router;
