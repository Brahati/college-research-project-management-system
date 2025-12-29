import { useState } from "react";
import api from "../services/api";

function PitchProject({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    team_size: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/company/projects", {
        title: form.title,
        description: form.description,
        department: form.department,
        team_size: Number(form.team_size)
      });

      alert("Project submitted for admin approval");

      setForm({
        title: "",
        description: "",
        department: "",
        team_size: ""
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit project");
    }
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2>Pitch New Project</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="department"
          placeholder="Department (e.g. CSE)"
          value={form.department}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="team_size"
          type="number"
          placeholder="Team Size"
          value={form.team_size}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Submit Project</button>
      </form>
    </div>
  );
}

export default PitchProject;
