import { useEffect, useState } from "react";
import api from "../services/api";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

const fetchStats = async () => {
  const res = await api.get("/admin/stats");
  setStats(res.data);
};


  const fetchPendingProjects = async () => {
    try {
      const res = await api.get("/admin/projects/pending");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending projects");
    }
  };

  useEffect(() => {
  (async () => {
    await fetchPendingProjects();
    fetchStats();
  })();
}, []);

  const updateStatus = async (projectId, status) => {
  try {
    await api.post("/admin/projects/status", {
      project_id: projectId,
      status,
    });

    alert(`Project ${status}`);
    fetchPendingProjects();
  } catch (err) {
    console.error(err);
    alert("Action failed");
  }
};

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Admin Dashboard</h1>

      <h2>Pending Projects</h2>

      {projects.length === 0 ? (
        <p>No pending projects</p>
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
            <h3>{p.title}</h3>
            <p><b>Company:</b> {p.company_name}</p>
            <p><b>Department:</b> {p.department}</p>
            <p>{p.description}</p>

            <button 
              onClick={() => updateStatus(p.project_id, "APPROVED")}
            >
              Approve
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => updateStatus(p.project_id, "REJECTED")}
            >
              Reject
            </button>

          </div>
        ))
      )}
      {stats && (
  <>
      <h2>Project Status Overview</h2>
          <Pie
            data={{
              labels: stats.statusStats.map(s => s.status),
              datasets: [{
                data: stats.statusStats.map(s => s.count),
                backgroundColor: ["orange", "green", "red"]
              }]
            }}
          />

          <h2 style={{ marginTop: "40px" }}>Department-wise Projects</h2>
          <Bar
            data={{
              labels: stats.departmentStats.map(d => d.department),
              datasets: [{
                label: "Projects",
                data: stats.departmentStats.map(d => d.count),
                backgroundColor: "skyblue"
              }]
            }}
          />
        </>
      )}

    </div>
  );
}

export default AdminDashboard;
