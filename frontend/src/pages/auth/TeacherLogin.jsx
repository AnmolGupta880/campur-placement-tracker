import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginTeacher } from "../../services/api";
import "./Auth.css";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginTeacher({ email, password });
      login(data);
      navigate("/teacher/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">👨‍🏫 Teacher Login</h2>
        <p className="auth-subtitle">Access your teacher dashboard</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/teacher/signup")}
          >
            Sign up
          </span>
        </p>

        <p className="auth-footer">
          Student?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Student Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default TeacherLogin;

