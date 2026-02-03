const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const controller = require("../controllers/reportDownloadController");
console.log("auth:", typeof auth);
console.log("downloadStudentReport:", typeof controller.downloadStudentReport);
console.log("downloadFacultyReport:", typeof controller.downloadFacultyReport);
console.log("downloadCompanyReport:", typeof controller.downloadCompanyReport);
console.log("downloadAdminReport:", typeof controller.downloadAdminReport);

router.get("/student/pdf", verifyToken, controller.downloadStudentReport);
router.get("/faculty/pdf", verifyToken, controller.downloadFacultyReport);
router.get("/company/pdf", verifyToken, controller.downloadCompanyReport);
router.get("/admin/pdf", verifyToken, controller.downloadAdminReport);

module.exports = router;
