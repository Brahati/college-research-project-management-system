import { useState } from "react";
import api from "../services/api";

function PitchProject({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    team_size: "",
    budget: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/company/projects", {
        title: form.title,
        description: form.description,
        department: form.department,
        team_size: Number(form.team_size),
        budget: Number(form.budget)
      });

      alert("Project submitted for admin approval");

      setForm({
        title: "",
        description: "",
        department: "",
        team_size: "",
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit project");
    }
  };

  return (
    <div>
      <h2 style={sectionTitle}>Pitch New Project</h2>

      <form onSubmit={handleSubmit}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Project Title</label>
          <input
            name="title"
            placeholder="Enter project title"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Project Description</label>
          <textarea
            name="description"
            placeholder="Describe the project"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            style={textareaStyle}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Department</label>
          <input
            name="department"
            placeholder="e.g. CSE"
            value={form.department}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Team Size</label>
          <input
            name="team_size"
            type="number"
            placeholder="e.g. 4"
            value={form.team_size}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldGroup}>
  <label style={labelStyle}>Project Budget (₹)</label>
  <input
    name="budget"
    type="number"
    placeholder="e.g. 500000"
    value={form.budget}
    onChange={handleChange}
    required
    style={inputStyle}
  />
</div>


        <button type="submit" style={submitButtonStyle}>
          Submit Project
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const sectionTitle = {
  color: "#0a2a66",
  marginBottom: "16px",
};

const fieldGroup = {
  marginBottom: "16px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "600",
  color: "#0a2a66",
};

/* 🔥 FIXED INPUT STYLE */
const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",   // ✅ white
  color: "#000000",             // ✅ black text
};

/* 🔥 FIXED TEXTAREA STYLE */
const textareaStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
  backgroundColor: "#ffffff",   // ✅ white
  color: "#000000",             // ✅ black text
};

const submitButtonStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default PitchProject;
