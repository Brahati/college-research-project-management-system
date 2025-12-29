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

