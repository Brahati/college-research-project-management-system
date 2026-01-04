/*import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

function ProjectUpdates({ projectId }) {
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUpdates = useCallback(async () => {
    if (!projectId) return;

    try {
      const res = await api.get(`/projects/${projectId}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load updates");
    }
  }, [projectId]);

  useEffect(() => {
  (async () => {
    await fetchUpdates();
  })();
}, [fetchUpdates]);

  const postUpdate = async () => {
    if (!message.trim()) {
      alert("Enter a message");
      return;
    }

    try {
      await api.post("/projects/update", {
        project_id: projectId,
        message
      });

      setMessage("");
      fetchUpdates();
    } catch (err) {
      console.error(err);
      alert("Failed to post update");
    }
  };
  */
/*
  useEffect(() => {
  (async () => {
    await fetchUpdates();
  })();
}, [projectId]);

    useEffect(() => {
  const fetchUpdates = async () => {
    try {
      const res = await api.get(`/company/projects/${projectId}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load updates");
    }
  };

  if (projectId) {
    fetchUpdates();
  }
}, [projectId]);
*/
/*
  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #444", paddingTop: "15px" }}>
      <h4>Project Updates</h4>

      <p style={{ color: "#aaa", fontSize: "14px" }}>
        Project ID: <b>{projectId}</b>
      </p>

      {updates.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        updates.map((u, idx) => (
          <div key={idx} style={{ border: "1px solid #555", padding: "10px", marginBottom: "8px" }}>
            <p><b>{u.sender_role}</b></p>
            <p>{u.message}</p>
            <small>{new Date(u.created_at).toLocaleString()}</small>
          </div>
        ))
      )}

      <textarea
        placeholder="Add update..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button onClick={postUpdate} style={{ marginTop: "10px" }}>
        Post Update
      </button>
    </div>
  );
}

export default ProjectUpdates;
*//*
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

function ProjectUpdates({ projectId }) {
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUpdates = useCallback(async () => {
    if (!projectId) return;

    try {
      const res = await api.get(`/company/projects/${projectId}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load updates");
    }
  }, [projectId]);

  useEffect(() => {
    (async () => {
    await fetchUpdates();
  })();
  }, [fetchUpdates]);

  const postUpdate = async () => {
    if (!message.trim()) {
      alert("Enter a message");
      return;
    }

    try {
      await api.post("/company/projects/update", {
        project_id: projectId,
        message,
      });

      setMessage("");
      fetchUpdates(); // ✅ NOW WORKS
    } catch (err) {
      console.error(err);
      alert("Failed to post update");
    }
  };

  return (
    <div style={{ marginTop: "20px", borderTop: "1px solid #444", paddingTop: "15px" }}>
      <h4>Project Updates</h4>

      <p style={{ color: "#aaa", fontSize: "14px" }}>
        Project ID: <b>{projectId}</b>
      </p>

      {updates.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        updates.map((u, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #555",
              padding: "10px",
              marginBottom: "8px",
            }}
          >
            <p><b>{u.sender_role}</b></p>
            <p>{u.message}</p>
            <small>{new Date(u.created_at).toLocaleString()}</small>
          </div>
        ))
      )}

      <textarea
        placeholder="Add update..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button onClick={postUpdate} style={{ marginTop: "10px" }}>
        Post Update
      </button>
    </div>
  );
}

export default ProjectUpdates;
*/
import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

function ProjectUpdates({ projectId }) {
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUpdates = useCallback(async () => {
    if (!projectId) return;

    try {
      const res = await api.get(`/company/projects/${projectId}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load updates");
    }
  }, [projectId]);

  useEffect(() => {
    (async () => {
      await fetchUpdates();
    })();
  }, [fetchUpdates]);

  const postUpdate = async () => {
    if (!message.trim()) {
      alert("Enter a message");
      return;
    }

    try {
      await api.post("/company/projects/update", {
        project_id: projectId,
        message,
      });

      setMessage("");
      fetchUpdates();
    } catch (err) {
      console.error(err);
      alert("Failed to post update");
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        borderTop: "1px solid #ccc",
        paddingTop: "15px",
      }}
    >
      <h4 style={{ marginBottom: "6px" }}>Project Updates</h4>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Project ID: <b>{projectId}</b>
      </p>

      {updates.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        updates.map((u, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ddd",
              backgroundColor: "#ffffff",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
              {u.sender_role}
            </p>
            <p style={{ margin: "0 0 6px 0", color: "#000000" }}>
              {u.message}
            </p>
            <small style={{ color: "#555" }}>
              {new Date(u.created_at).toLocaleString()}
            </small>
          </div>
        ))
      )}

      {/* ADD UPDATE */}
      <textarea
        placeholder="Add update..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="3"
        style={{
          width: "100%",
          marginTop: "10px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          backgroundColor: "#ffffff",   // ✅ white
          color: "#000000",             // ✅ black text
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={postUpdate}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#000000",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Post Update
      </button>
    </div>
  );
}

export default ProjectUpdates;
