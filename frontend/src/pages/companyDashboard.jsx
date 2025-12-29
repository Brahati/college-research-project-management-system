import { useEffect, useState } from "react";
import api from "../services/api";
import PitchProject from "./pitchProject"; 
import ProjectUpdates from "../components/projectUpdates";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);



function CompanyDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const approved = projects.filter(p => p.status === "APPROVED").length;
  const pending = projects.filter(p => p.status === "PENDING").length;
  const rejected = projects.filter(p => p.status === "REJECTED").length;

  const companyPieData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["lightgreen", "orange", "salmon"]
      }
    ]
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/company/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Company Dashboard</h1>

      {/* 🔷 F6.3 — Pitch Project Form */}
      <PitchProject onSuccess={fetchProjects} />

      <h2>My Projects</h2>

      {projects.length === 0 ? (
        <p>No projects pitched yet</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.project_id}
            style={{
              border: "1px solid #555",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <ProjectUpdates projectId={p.project_id} />
            <h3>{p.title}</h3>
            <p>
              <b>Department:</b> {p.department}
            </p>
            <p>
              <b>Team Size:</b> {p.team_size}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    p.status === "APPROVED"
                      ? "lightgreen"
                      : p.status === "REJECTED"
                      ? "salmon"
                      : "orange",
                }}
              >
                {p.status}
              </span>
            </p>
          </div>
        ))
      )}
      <p>Total Projects: {projects.length}</p>
        <p>Approved: {approved}</p>
        <p>Pending: {pending}</p>
      <h3>Project Status Overview</h3>

      <Pie data={companyPieData} />

    </div>
  );
}

export default CompanyDashboard;
