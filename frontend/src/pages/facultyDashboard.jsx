import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectUpdates from "../components/projectUpdates";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
				   
	
				  

ChartJS.register(ArcElement, Tooltip, Legend);

function FacultyDashboard() {
																 
  const [myProjects, setMyProjects] = useState([]);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [loading, setLoading] = useState(false);

													

  /* ---------------- FETCH MY PROJECTS ---------------- */
  const fetchMyProjects = async () => {
    try {
      const res = await api.get("/faculty/projects/my");
      setMyProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch faculty projects:", err);
      alert("Unable to load your projects");
      setMyProjects([]);
    }
  };

  /* ---------------- FETCH AVAILABLE PROJECTS ---------------- */
  const fetchAvailableProjects = async () => {
    try {
      const res = await api.get("/faculty/projects/available");
      setAvailableProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch available projects:", err);
      alert("Unable to load available projects");
      setAvailableProjects([]);
    }
  };

  /* ---------------- FETCH APPLICATIONS ---------------- */
  const fetchApplications = async (projectId) => {
						 
    if (!projectId) return;

    try {
      const res = await api.get(
        `/faculty/projects/${projectId}/applications`
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      alert("Unable to load applications for this project");
      setApplications([]);
			   
							
    }
  };

												 

  /* ---------------- UNDERTAKE PROJECT ---------------- */
  const undertakeProject = async (projectId) => {
    try {
      await api.post("/faculty/projects/undertake", {
        project_id: projectId
      });

      alert("Project undertaken successfully");

      await fetchAvailableProjects();
      await fetchMyProjects();
    } catch (err) {
      console.error("Failed to undertake project:", err);
      alert(
        err.response?.data?.message ||
          "Failed to undertake project"
      );
    }
  };

  /* ---------------- ACCEPT / REJECT APPLICATION ---------------- */
  const updateApplicationStatus = async (applicationId, status) => {
    if (!applicationId || !status) return;

    try {
      await api.post("/faculty/applications/update", {
        application_id: applicationId,
        status
      });

      alert(`Application ${status}`);
      await fetchApplications(expandedProject);
    } catch (err) {
      console.error("Failed to update application:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update application"
      );
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await fetchMyProjects();
        await fetchAvailableProjects();
      } catch (err) {
        console.error("Faculty dashboard init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /* ---------------- PIE DATA ---------------- */
  const pieData = {
    labels: ["My Projects", "Available Projects"],
    datasets: [
      {
        data: [myProjects.length, availableProjects.length],
        backgroundColor: ["#4fc3f7", "#90a4ae"]
      }
    ]
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return <p style={{ padding: "30px" }}>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Faculty Dashboard</h1>

									   
					   
															
							  
			

      {/* ================= MY PROJECTS ================= */}
      <h2>My Projects</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Company</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {myProjects.length === 0 ? (
            <tr>
              <td colSpan="3">No projects assigned yet</td>
            </tr>
          ) : (
            myProjects.map((p) => (
              <>
                <tr key={p.project_id}>
                  <td
                    style={{ cursor: "pointer", color: "#4fc3f7" }}
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
                  <td>{p.company_name}</td>
                  <td>{p.status}</td>
                </tr>
		  
		

                {expandedProject === p.project_id && (
                  <tr>
                    <td colSpan="3">
                      <h4>Applications</h4>

                      {applications.length === 0 ? (
                        <p>No applications yet</p>
                      ) : (
                        <table
                          border="1"
                          width="100%"
                          cellPadding="8"
                        >
                          <thead>
                            <tr>
                              <th>Student</th>
                              <th>Email</th>
                              <th>Statement</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications.map((a) => (
			  
                              <tr key={a.application_id}>
                                <td>{a.student}</td>
                                <td>{a.email}</td>
                                <td>
                                  {a.statement_of_interest}
                                </td>
                                <td>
                                  {a.status === "PENDING" ? (
                                    <>
                                      <button
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
                                          marginLeft: "8px"
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

                      <ProjectUpdates
                        projectId={p.project_id}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
        </tbody>
      </table>

      {/* ================= AVAILABLE PROJECTS ================= */}
      <h2 style={{ marginTop: "40px" }}>
        Available Projects
      </h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Company</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {availableProjects.length === 0 ? (
            <tr>
              <td colSpan="3">No available projects</td>
            </tr>
          ) : (
            availableProjects.map((p) => (
              <>
                <tr key={p.project_id}>
                  <td
                    style={{
                      cursor: "pointer",
                      color: "#81c784"
                    }}
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
                  <td>{p.company_name}</td>
                  <td>{p.department}</td>
											
					
						   
									
																			 
					   
					 
							
                </tr>

                {expandedProject === p.project_id && (
                  <tr>
                    <td colSpan="3">
                      <p>{p.description}</p>
                      <button
                        onClick={() =>
                          undertakeProject(p.project_id)
                        }
                      >
                        Undertake Project
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
        </tbody>
      </table>

      {/* ================= SUMMARY ================= */}
      <h2 style={{ marginTop: "5px" }}>
        Workload Overview
      </h2>
      <Pie data={pieData} />
    </div>
  );
}

export default FacultyDashboard;
