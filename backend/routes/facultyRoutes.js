/*const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const {
  viewApplications,
  updateApplication
} = require("../controllers/facultyController");
const { requireRole } = require("../middleware/roleMiddleware");

const { getAvailableProjects } = require("../controllers/facultyController");

const { undertakeProject } = require("../controllers/facultyController");

const { getMyProjects } = require("../controllers/facultyController");

const { getApplicationsForProject } = require("../controllers/facultyController");

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

router.get(
  "/projects/:projectId/applications",
  verifyToken,
  allowRoles("FACULTY"),
  getApplicationsForProject
);


router.get(
  "/projects/my",
  verifyToken,
  allowRoles("FACULTY"),
  getMyProjects
);


router.post(
  "/projects/undertake",
  verifyToken,
  allowRoles("FACULTY"),
  undertakeProject
);


router.get(
  "/projects/available",
  verifyToken,
  requireRole("FACULTY"),
  getAvailableProjects
);


router.get(
  "/applications",
  verifyToken,
  allowRoles("FACULTY"),
  viewApplications
);

router.post(
  "/application/update",
  verifyToken,
  allowRoles("FACULTY"),
  updateApplication
);

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const {
  getAvailableProjects,
  undertakeProject,
  getMyProjects,
  getApplicationsForProject,
  viewApplications,
  updateApplication
} = require("../controllers/facultyController");

const {
  addProjectUpdate,
  getProjectUpdates
} = require("../controllers/companyController");

console.log("getApplicationsForProject:", typeof getApplicationsForProject);



/* ===== Projects ===== */
router.get("/projects/available", verifyToken, allowRoles("FACULTY"), getAvailableProjects);
router.post("/projects/undertake", verifyToken, allowRoles("FACULTY"), undertakeProject);
router.get("/projects/my", verifyToken, allowRoles("FACULTY"), getMyProjects);

/* ===== Applications ===== */
router.get("/projects/:projectId/applications", verifyToken, allowRoles("FACULTY"), getApplicationsForProject);
router.get("/applications", verifyToken, allowRoles("FACULTY"), viewApplications);
router.post("/application/update", verifyToken, allowRoles("FACULTY"), updateApplication);

/* ===== Updates ===== */
router.post("/projects/update", verifyToken, allowRoles("FACULTY", "COMPANY"), addProjectUpdate);
router.get("/projects/:projectId/updates", verifyToken, allowRoles("FACULTY", "COMPANY"), getProjectUpdates);

module.exports = router;
/*module.exports = {
  viewApplications,
  updateApplication,
  getAvailableProjects,
  undertakeProject,
  getMyProjects,
  getApplicationsForProject
};
*/
