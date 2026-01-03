import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signupTeacher } from "../../services/api";
import "./Auth.css";

const TeacherSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signupTeacher({ name, email, password });
      login(data);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Teacher Signup</h2>
        <p className="auth-subtitle">Create your teacher account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="auth-button">
            Signup
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/teacher/login")}
          >
            Login
          </span>
        </p>

        <p className="auth-footer">
          Student?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/signup")}
          >
            Student Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default TeacherSignup;

