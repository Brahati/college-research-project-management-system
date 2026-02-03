import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import rvceLogo from "../assets/rvce_logo.png";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

/* 🔒 FIXED STATUS → COLOR MAPPING */
const STATUS_COLORS = {
  PENDING: "#fbc02d",   // Yellow
  APPROVED: "#2e7d32",  // Green
  REJECTED: "#b00020",  // Red
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ---------------- FETCH STATS ---------------- */
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  /* ---------------- FETCH PENDING PROJECTS ---------------- */
  const fetchPendingProjects = async () => {
    try {
      const res = await api.get("/admin/projects/pending");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending projects");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchPendingProjects();
      await fetchStats();
    })();
  }, []);

  /* ---------------- UPDATE PROJECT STATUS ---------------- */
  const updateStatus = async (projectId, status) => {
    try {
      await api.post("/admin/projects/status", {
        project_id: projectId,
        status,
      });

      alert(`Project ${status}`);
      fetchPendingProjects();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const downloadAdminPDF = async () => {
  const res = await api.get("/reports/download/admin/pdf", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Admin_Report.pdf");
  link.click();
};


  /* ---------------- NORMALIZE STATUS ORDER ---------------- */
  const orderedStatusStats = stats
    ? ["PENDING", "APPROVED", "REJECTED"].map((status) => {
        const found = stats.statusStats.find(
          (s) => s.status === status
        );
        return found || { status, count: 0 };
      })
    : [];

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <img src={rvceLogo} alt="RVCE Logo" style={logoStyle} />
        <h1 style={centerTitleStyle}>Admin Dashboard</h1>
        {/* Button Wrapper to stack them */}
        <div style={buttonGroupStyle}>
          <button style={logoutButtonStyle} onClick={handleLogout}>
            Logout
          </button>
          <button style={actionButtonStyle} onClick={downloadAdminPDF}>
            Download Report (PDF)
          </button>
        </div>
      </div>

      {/* ================= PENDING PROJECTS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>Pending Projects</h2>

        {projects.length === 0 ? (
          <p>No pending projects</p>
        ) : (
          projects.map((p) => (
            <div key={p.project_id} style={projectCardStyle}>
              <h3 style={projectTitleStyle}>{p.title}</h3>

              <p><b>Company:</b> {p.company_name}</p>
              <p><b>Department:</b> {p.department}</p>
              <p>
                <b>Budget:</b>{" "}
                ₹{Number(p.budget).toLocaleString("en-IN")}
              </p>
              <p>{p.description}</p>

              <div style={{ marginTop: "12px" }}>
                <button
                  style={approveButtonStyle}
                  onClick={() =>
                    updateStatus(p.project_id, "APPROVED")
                  }
                >
                  Approve
                </button>

                <button
                  style={rejectButtonStyle}
                  onClick={() =>
                    updateStatus(p.project_id, "REJECTED")
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= PIE CHART ================= */}
      {stats && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Project Status Overview</h2>

          <div style={chartWrapper}>
            <Pie
              data={{
                labels: orderedStatusStats.map((s) => s.status),
                datasets: [
                  {
                    data: orderedStatusStats.map((s) => s.count),
                    backgroundColor: orderedStatusStats.map(
                      (s) => STATUS_COLORS[s.status]
                    ),
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      {/* ================= BAR CHART: PROJECT COUNT ================= */}
      {stats && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Department-wise Projects</h2>

          <div style={barWrapper}>
            <Bar
              data={{
                labels: stats.departmentStats.map(
                  (d) => d.department
                ),
                datasets: [
                  {
                    label: "Number of Projects",
                    data: stats.departmentStats.map(
                      (d) => d.count
                    ),
                    backgroundColor: "#90caf9",
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      {/* ================= BAR CHART: BUDGET ================= */}
      {stats?.departmentBudgetStats && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>
            Department-wise Project Budget (₹)
          </h2>

          <div style={barWrapper}>
            <Bar
              data={{
                labels: stats.departmentBudgetStats.map(
                  (d) => d.department
                ),
                datasets: [
                  {
                    label: "Total Budget (₹)",
                    data: stats.departmentBudgetStats.map(
                      (d) => d.total_budget
                    ),
                    backgroundColor: "#4caf50",
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (ctx) =>
                        `₹${Number(ctx.raw).toLocaleString("en-IN")}`,
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
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

const projectCardStyle = {
  backgroundColor: "#ffffff",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  marginBottom: "16px",
};

const projectTitleStyle = {
  marginTop: 0,
  color: "#0a2a66",
};

const approveButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#2e7d32",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const rejectButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#b00020",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginLeft: "10px",
};

const chartWrapper = {
  width: "260px",
  height: "260px",
  margin: "0 auto",
};

const barWrapper = {
  maxWidth: "700px",
  margin: "0 auto",
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

export default AdminDashboard;

