import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import rvceLogo from "../assets/rvce_logo.png";
import PitchProject from "./pitchProject";
import ProjectUpdates from "../components/projectUpdates";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CompanyDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [showPitch, setShowPitch] = useState(false);

  /* ---------------- STATS ---------------- */
  const approved = projects.filter(p => p.status === "APPROVED").length;
  const pending = projects.filter(p => p.status === "PENDING").length;
  const rejected = projects.filter(p => p.status === "REJECTED").length;

  const companyPieData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["#2e7d32", "#f57c00", "#b00020"],
      },
    ],
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ---------------- FETCH COMPANY PROFILE ---------------- */
  const fetchCompanyProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setCompanyName(res.data.company_name || res.data.name || "Company");
    } catch {
      setCompanyName("Company");
    }
  };

  /* ---------------- FETCH PROJECTS ---------------- */
  const fetchProjects = async () => {
    try {
      const res = await api.get("/company/projects");
      setProjects(res.data || []);
    } catch {
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const downloadCompanyPDF = async () => {
  const res = await api.get("/reports/download/company/pdf", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Company_Report.pdf");
  link.click();
};


  useEffect(() => {
    fetchCompanyProfile();
    fetchProjects();
  }, []);

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <img src={rvceLogo} alt="RVCE Logo" style={logoStyle} />
        <h1 style={centerTitleStyle}>Welcome, {companyName}</h1>
        {/* Button Wrapper to stack them */}
        <div style={buttonGroupStyle}>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            Logout
          </button>
          <button style={actionButtonStyle} onClick={downloadCompanyPDF}>
            Download Report (PDF)
          </button>
        </div>
      </div>

      {/* ================= PITCH PROJECT ================= */}
      <div style={cardStyle}>
        <h3
          style={expandableTitle}
          onClick={() => setShowPitch(!showPitch)}
        >
          ➕ Pitch New Project
        </h3>

        {showPitch && (
          <div style={expandBoxStyle}>
            <PitchProject onSuccess={fetchProjects} />
          </div>
        )}
      </div>

      {/* ================= MY PROJECTS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>My Projects</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Project Title</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan="3">
                  No projects pitched yet
                </td>
              </tr>
            ) : (
              projects.map(p => (
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
                    <td style={tdStyle}>{p.department}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontWeight: "600",
                          color:
                            p.status === "APPROVED"
                              ? "#2e7d32"
                              : p.status === "REJECTED"
                              ? "#b00020"
                              : "#f57c00",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>

                  {expandedProject === p.project_id && (
                    <tr>
                      <td colSpan="3" style={tdStyle}>
                        <p><b>Team Size:</b> {p.team_size}</p>

                        <div style={updateBoxStyle}>
                          <ProjectUpdates projectId={p.project_id} />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PIE ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>Project Status Overview</h2>

        <p>Total Projects: {projects.length}</p>
        <p>Approved: {approved}</p>
        <p>Pending: {pending}</p>
        <p>Rejected: {rejected}</p>

        <div style={pieWrapper}>
          <Pie data={companyPieData} />
        </div>
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
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const logoStyle = { height: "50px" };

const centerTitleStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "28px",
  fontWeight: "600",
  color: "#0a2a66",
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

const expandableTitle = {
  color: "#0a2a66",
  cursor: "pointer",
  marginBottom: "10px",
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
};

const linkStyle = {
  color: "#0a2a66",
  cursor: "pointer",
  fontWeight: "600",
};

const expandBoxStyle = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #d0d7e2",
};

const updateBoxStyle = {
  marginTop: "12px",
  padding: "12px",
  backgroundColor: "#e3f2fd",
  borderRadius: "8px",
};

const pieWrapper = {
  width: "260px",
  height: "260px",
  margin: "20px auto 0",
};

const actionButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px", 
  width: "100%",    
};

const buttonGroupStyle = {
  display: "flex",
  flexDirection: "column", 
  gap: "10px",             
  alignItems: "flex-end",  
};

const logoutButtonStyle = {
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
  width: "100%",    
};

export default CompanyDashboard;
