import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProjectUpdates from "../components/projectUpdates";

import rvceLogo from "../assets/rvce_logo.png";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function FacultyDashboard() {
  const navigate = useNavigate();

  const [myProjects, setMyProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ---------------- FETCH DATA ---------------- */
  const fetchMyProjects = async () => {
    const res = await api.get("/faculty/projects/my");
    setMyProjects(res.data || []);
  };

  const fetchAvailableProjects = async () => {
    const res = await api.get("/faculty/projects/available");
    setAvailableProjects(res.data || []);
  };

  const fetchApplications = async (projectId) => {
    if (!projectId) return;
    const res = await api.get(
      `/faculty/projects/${projectId}/applications`
    );
    setApplications(res.data || []);
  };

  const undertakeProject = async (projectId) => {
    await api.post("/faculty/projects/undertake", {
      project_id: projectId,
    });
    fetchAvailableProjects();
    fetchMyProjects();
  };

  const updateApplicationStatus = async (id, status) => {
    await api.post("/faculty/application/update", {
      application_id: id,
      status,
    });
    fetchApplications(expandedProject);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchMyProjects();
      await fetchAvailableProjects();
      setLoading(false);
    };
    init();
  }, []);

  const pieData = {
    labels: ["My Projects", "Available Projects"],
    datasets: [
      {
        data: [myProjects.length, availableProjects.length],
        backgroundColor: ["#0a2a66", "#90a4ae"],
      },
    ],
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        <img src={rvceLogo} alt="RVCE Logo" style={logoStyle} />

        <h1 style={centerTitleStyle}>Faculty Dashboard</h1>

        <button style={logoutButtonStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= MY PROJECTS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>My Projects</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Project Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {myProjects.length === 0 ? (
              <tr>
                <td style={tdStyle} colSpan="3">
                  No projects assigned
                </td>
              </tr>
            ) : (
              myProjects.map((p) => (
                <>
                  <tr key={p.project_id}>
                    <td
                      style={{ ...tdStyle, ...linkStyle }}
                      onClick={() => {
                        const next =
                          expandedProject === p.project_id
                            ? null
                            : p.project_id;
                        setExpandedProject(next);
                        if (next) fetchApplications(p.project_id);
                      }}
                    >
                      {p.title}
                    </td>
                    <td style={tdStyle}>{p.company_name}</td>
                    <td style={tdStyle}>{p.status}</td>
                  </tr>

                  {expandedProject === p.project_id && (
                    <tr>
                      <td style={tdStyle} colSpan="3">
                        <h4>Applications</h4>

                        {applications.length === 0 ? (
                          <p>No applications yet</p>
                        ) : (
                          <table style={innerTableStyle}>
                            <thead>
                              <tr>
                                <th style={thStyle}>Student</th>
                                <th style={thStyle}>Email</th>
                                <th style={thStyle}>Statement</th>
                                <th style={thStyle}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applications.map((a) => (
                                <tr key={a.application_id}>
                                  <td style={tdStyle}>{a.student}</td>
                                  <td style={tdStyle}>{a.email}</td>
                                  <td style={tdStyle}>
                                    {a.statement_of_interest}
                                  </td>
                                  <td style={tdStyle}>
                                    {a.status === "PENDING" ? (
                                      <>
                                        <button
                                          style={actionButtonStyle}
                                          onClick={() =>
                                            updateApplicationStatus(
                                              a.application_id,
                                              "ACCEPTED"
                                            )
                                          }
                                        >
                                          Accept
                                        </button>
                                        <button
                                          style={{
                                            ...actionButtonStyle,
                                            marginLeft: "8px",
                                            backgroundColor: "#b00020",
                                          }}
                                          onClick={() =>
                                            updateApplicationStatus(
                                              a.application_id,
                                              "REJECTED"
                                            )
                                          }
                                        >
                                          Reject
                                        </button>
                                      </>
                                    ) : (
                                      a.status
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <ProjectUpdates projectId={p.project_id} />
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= AVAILABLE PROJECTS ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>Available Projects</h2>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Project Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Department</th>
            </tr>
          </thead>
          <tbody>
            {availableProjects.map((p) => (
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
                  <td style={tdStyle}>{p.company_name}</td>
                  <td style={tdStyle}>{p.department}</td>
                </tr>

                {expandedProject === p.project_id && (
                  <tr>
                    <td style={tdStyle} colSpan="3">
                      <p>{p.description}</p>
                      <button
                        style={actionButtonStyle}
                        onClick={() => undertakeProject(p.project_id)}
                      >
                        Undertake Project
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PIE ================= */}
      <div style={cardStyle}>
        <h2 style={sectionTitle}>Workload Overview</h2>
        <div style={pieWrapper}>
          <Pie data={pieData} />
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

const logoutButtonStyle = {
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
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

const innerTableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "12px",
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

const actionButtonStyle = {
  padding: "8px 14px",
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const pieWrapper = {
  width: "260px",
  height: "260px",
  margin: "0 auto",
};

export default FacultyDashboard;
