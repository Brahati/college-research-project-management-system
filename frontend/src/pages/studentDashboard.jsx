import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import rvceLogo from "../assets/rvce_logo.png";

function StudentDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ---------------- FETCH AVAILABLE PROJECTS ---------------- */
  const fetchProjects = async () => {
    try {
      const res = await api.get("/student/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects");
      setProjects([]);
    }
  };

  /* ---------------- FETCH MY APPLICATIONS ---------------- */
  const fetchMyApplications = async () => {
    try {
      const res = await api.get("/student/applications");
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setApplications([]);
    }
  };

  /* ---------------- APPLY TO PROJECT ---------------- */
  const applyToProject = async (projectId, statement) => {
    if (!statement) {
      alert("Please enter a statement of interest");
      return;
    }

    try {
      await api.post("/student/apply", {
        project_id: projectId,
        statement_of_interest: statement,
      });

      alert("Application submitted");
      setExpandedProject(null);
      fetchMyApplications();
    } catch (err) {
      console.error("Failed to apply:", err);
      alert(
        err.response?.data?.message ||
          "Failed to submit application"
      );
    }
  };

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    (async () => {
      await fetchProjects();
      fetchMyApplications();
    })();
  }, []);

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <img src={rvceLogo} alt="RVCE Logo" style={logoStyle} />
        <h1 style={centerTitleStyle}>Student Dashboard</h1>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <p style={errorStyle}>{error}</p>}

      {/* ================= AVAILABLE PROJECTS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>Available Projects</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Project Title</th>
              <th style={thStyle}>Faculty</th>
              <th style={thStyle}>Company</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan="3">
                  No projects available
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <>
                  <tr key={p.project_id}>
                    <td
                      style={{ ...tdStyle, ...linkStyle }}
                      onClick={() =>
                        setExpandedProject(
                          expandedProject === p.project_id
                            ? null
                            : p.project_id
                        )
                      }
                    >
                      {p.title}
                    </td>
                    <td style={tdStyle}>
                      {p.faculty_name || "Not Assigned"}
                    </td>
                    <td style={tdStyle}>{p.company_name}</td>
                  </tr>

                  {expandedProject === p.project_id && (
                    <tr>
                      <td style={tdStyle} colSpan="3">
                        <textarea
                          rows="3"
                          placeholder="Statement of Interest"
                          style={textareaStyle}
                          onChange={(e) =>
                            setProjects((prev) =>
                              prev.map((proj) =>
                                proj.project_id === p.project_id
                                  ? {
                                      ...proj,
                                      statement: e.target.value,
                                    }
                                  : proj
                              )
                            )
                          }
                        />

                        <button
                          style={actionButtonStyle}
                          onClick={() =>
                            applyToProject(
                              p.project_id,
                              p.statement
                            )
                          }
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MY APPLICATIONS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>My Applications</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Project</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Statement</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan="3">
                  No applications yet
                </td>
              </tr>
            ) : (
              applications.map((a) => (
                <tr key={a.application_id}>
                  <td style={tdStyle}>{a.project_title}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "600",
                      color:
                        a.status === "ACCEPTED"
                          ? "green"
                          : a.status === "REJECTED"
                          ? "#b00020"
                          : "#f57c00",
                    }}
                  >
                    {a.status}
                  </td>
                  <td style={tdStyle}>
                    {a.statement_of_interest}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  padding: "30px",
  fontFamily: "Arial, sans-serif",
  color: "#000000",
};

const headerStyle = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "30px",
};

const logoStyle = {
  height: "50px",
};

const centerTitleStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  margin: 0,
  fontSize: "28px",
  fontWeight: "600",
  color: "#0a2a66",
};

const logoutButtonStyle = {
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
};

const errorStyle = {
  color: "#b00020",
  marginBottom: "16px",
};

const cardStyle = {
  backgroundColor: "#f4f6fa",
  padding: "24px",
  borderRadius: "10px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: "30px",
};

const sectionTitle = {
  color: "#0a2a66",
  marginBottom: "16px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  backgroundColor: "#e9ecf3",
  color: "#0a2a66",
  fontWeight: "600",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e0e0e0",
  verticalAlign: "top",
};

const linkStyle = {
  color: "#0a2a66",
  cursor: "pointer",
  fontWeight: "600",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  fontFamily: "Arial, sans-serif",
};

const actionButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default StudentDashboard;
