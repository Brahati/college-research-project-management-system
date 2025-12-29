/*const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const {
  createProject,
  getMyProjects
} = require("../controllers/companyController");

const {
  addProjectUpdate,
  getProjectUpdates
} = require("../controllers/companyController");

// Add progress update (Faculty or Company)
router.post(
  "/projects/update",
  verifyToken,
  allowRoles("FACULTY", "COMPANY"),
  addProjectUpdate
);

// View progress updates
router.get(
  "/projects/:projectId/updates",
  verifyToken,
  allowRoles("FACULTY", "COMPANY"),
  getProjectUpdates
);

// Company creates (pitches) project
router.post(
  "/projects",
  verifyToken,
  allowRoles("COMPANY"),
  createProject
);

// Company views own projects
router.get(
  "/projects",
  verifyToken,
  allowRoles("COMPANY"),
  getMyProjects
);

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const {
  createProject,
  getMyProjects,
  addProjectUpdate,
  getProjectUpdates
} = require("../controllers/companyController");

/* Company Projects */
router.post("/projects", verifyToken, allowRoles("COMPANY"), createProject);
router.get("/projects", verifyToken, allowRoles("COMPANY"), getMyProjects);

/* Updates */
router.post("/projects/update", verifyToken, allowRoles("FACULTY", "COMPANY"), addProjectUpdate);
router.get("/projects/:projectId/updates", verifyToken, allowRoles("FACULTY", "COMPANY"), getProjectUpdates);

module.exports = router;
