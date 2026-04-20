import { useState } from "react";
import "./css/CreateEmployee.css";

const API = import.meta.env.VITE_API_URL;

type Props = {
  goBack: () => void;
};

function CreateEmployee({ goBack }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return "Name is required";
    }

    if (trimmedName.length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!trimmedEmail) { 
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Enter a valid email address";
    }

    if (!password.trim()) {
      return "Password is required";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return "";
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      const res = await fetch(`${API}/auth/create-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Failed to create employee";
        throw new Error(msg);
      }

      setMessage("Employee created successfully");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-container">
      <div className="employee-card">
        <button className="employee-back-btn" onClick={goBack}>
          Back
        </button>

        <h2 className="employee-title">Create Employee</h2>

        <div className="employee-form">
          <input
            className="employee-input"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="employee-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="employee-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="employee-btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>

          {message && <p className="employee-success">{message}</p>}
          {error && <p className="employee-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CreateEmployee;