const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reports.controller");

/* Role-wise reports */
router.get("/student", reportController.studentReport);
router.get("/faculty", reportController.facultyReport);
router.get("/company", reportController.companyReport);
router.get("/admin", reportController.adminReport);

module.exports = router;
