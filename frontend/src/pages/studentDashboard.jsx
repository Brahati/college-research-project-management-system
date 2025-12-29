import { useEffect, useState } from "react";
import api from "../services/api";

function StudentDashboard() {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [error, setError] = useState("");

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
        statement_of_interest: statement
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

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Student Dashboard</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ================= AVAILABLE PROJECTS ================= */}
      <h2>Available Projects</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Faculty</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="4">No projects available</td>
            </tr>
          ) : (
            projects.map((p) => (
              <>
                <tr key={p.project_id}>
                  <td
                    style={{ cursor: "pointer", color: "#4fc3f7" }}
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
                  <td>{p.faculty_name || "Not Assigned"}</td>
                  <td>{p.company_name}</td>
                  <td>{p.slots_available}</td>
                </tr>

                {expandedProject === p.project_id && (
                  <tr>
                    <td colSpan="4">
                      <textarea
                        rows="3"
                        placeholder="Statement of Interest"
                        style={{ width: "100%" }}
                        onChange={(e) =>
                          setProjects((prev) =>
                            prev.map((proj) =>
                              proj.project_id === p.project_id
                                ? {
                                    ...proj,
                                    statement: e.target.value
                                  }
                                : proj
                            )
                          )
                        }
                      />

                      <button
                        style={{ marginTop: "10px" }}
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

      {/* ================= MY APPLICATIONS ================= */}
      <h2 style={{ marginTop: "40px" }}>My Applications</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Statement</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="3">No applications yet</td>
            </tr>
          ) : (
            applications.map((a) => (
              <tr key={a.application_id}>
                <td>{a.project_title}</td>
                <td
                  style={{
                    color:
                      a.status === "ACCEPTED"
                        ? "lightgreen"
                        : a.status === "REJECTED"
                        ? "salmon"
                        : "orange"
                  }}
                >
                  {a.status}
                </td>
                <td>{a.statement_of_interest}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
