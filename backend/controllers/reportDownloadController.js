const db = require("../config/db");
const PDFDocument = require("pdfkit");

/* =========================================================
   GENERIC PDF GENERATOR (SAFE + FIXED)
========================================================= */
const generatePDF = (res, title, columns, rows) => {
  try {
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${title.replace(/\s+/g, "_")}.pdf`
    );

    doc.pipe(res);

    /* ---------- TITLE ---------- */
    doc.font("Helvetica-Bold").fontSize(18).text(String(title), {
      align: "center",
    });
    doc.moveDown(2);

    /* ---------- TABLE CONFIG ---------- */
    const startX = doc.page.margins.left;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidth = usableWidth / columns.length;
    let y = doc.y;

    /* ---------- HEADER ---------- */
    doc.font("Helvetica-Bold").fontSize(11);
    columns.forEach((col, i) => {
      doc.text(col.toUpperCase().replace("_", " "), startX + i * columnWidth, y, {
        width: columnWidth - 10, // Padding
      });
    });

    y = doc.y + 5; 
    doc.moveTo(startX, y).lineTo(startX + usableWidth, y).stroke();
    y += 10;

    /* ---------- ROWS ---------- */
    doc.font("Helvetica").fontSize(10);

    (rows || []).forEach((row) => {
      let maxRowHeight = 0;

      // 1. Calculate the height of the tallest cell in this row
      columns.forEach((col, i) => {
        const text = row[col] ? String(row[col]) : "-";
        const options = { width: columnWidth - 10 };
        const textHeight = doc.heightOfString(text, options);
        if (textHeight > maxRowHeight) maxRowHeight = textHeight;
      });

      // 2. Page wrap check: if the tallest cell won't fit, add a page
      if (y + maxRowHeight > doc.page.height - 60) {
        doc.addPage();
        y = doc.page.margins.top;
      }

      // 3. Render each cell using the same maxRowHeight
      columns.forEach((col, i) => {
        const text = row[col] ? String(row[col]) : "-";
        doc.text(text, startX + i * columnWidth, y, {
          width: columnWidth - 10,
        });
      });

      // 4. Move Y down by the height of the tallest cell + some padding
      y += maxRowHeight + 15; 
    });

    doc.end();
  } catch (e) {
    console.error("PDF GENERATION ERROR:", e);
    res.status(500).json({ message: "PDF generation failed" });
  }
};
/* =========================================================
   STUDENT REPORT
========================================================= */
exports.downloadStudentReport = (req, res) => {
  // 1. Safety check for the user object
    if (!req.user || !req.user.user_id) {
        console.error("PDF Error: No user found in request. Is auth middleware missing?");
        return res.status(401).json({ message: "Unauthorized: No user session found" });
    }
    const studentId = req.user.user_id;
  

  const sql =
    "SELECT project_title, company_name, statement_of_interest, application_status FROM student_application_report WHERE student_id = ?";

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch student report" });
    }

    generatePDF(
      res,
      "Student Application Report",
      ["project_title", "company_name", "statement_of_interest", "application_status"],
      results
    );
  });
};

/* =========================================================
   FACULTY REPORT
========================================================= */
exports.downloadFacultyReport = (req, res) => {
  const facultyId = req.user.user_id;

  const sql =
    "SELECT project_title, company_name, total_applications FROM faculty_project_report WHERE faculty_id = ?";

  db.query(sql, [facultyId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch faculty report" });
    }

    generatePDF(
      res,
      "Faculty Project Report",
      ["project_title", "company_name", "total_applications"],
      results
    );
  });
};

/* =========================================================
   COMPANY REPORT
========================================================= */
exports.downloadCompanyReport = (req, res) => {
  const companyId = req.user.user_id;

  const sql =
    "SELECT r.title, r.department, r.project_status, r.faculty_name FROM company_project_report r JOIN companies c ON r.company_id = c.company_id WHERE c.user_id = ?";

  db.query(sql, [companyId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch company report" });
    }

    generatePDF(
      res,
      "Company Project Report",
      ["title", "department", "project_status", "faculty_name"],
      results
    );
  });
};

/* =========================================================
   ADMIN REPORT
========================================================= */
exports.downloadAdminReport = (req, res) => {
  const sql =
    "SELECT title, department, company_name, status, faculty_name FROM admin_project_overview";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch admin report" });
    }

    generatePDF(
      res,
      "Admin Project Overview",
      ["title","department", "company_name", "status", "faculty_name"],
      results
    );
  });
};
