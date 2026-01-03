import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signup } from "../../services/api";
import { getColleges } from "../../services/api";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [college, setCollege] = useState("");
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const data = await getColleges();
        if (Array.isArray(data)) {
          setColleges(data);
          if (data.length === 0) {
            setError("No colleges available. Please contact administrator.");
          } else {
            setError(""); // Clear error if colleges loaded successfully
          }
        } else {
          setError("Invalid data received from server");
        }
      } catch (err) {
        console.error("College fetch error:", err);
        setError(`Failed to load colleges: ${err.message}. Check if backend is running.`);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signup({
        name,
        email,
        password,
        cgpa: parseFloat(cgpa),
        college,
      });
      login(data);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Student Signup</h2>
        <p className="auth-subtitle">Create your student account</p>

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

          <div className="form-group">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="CGPA (0-10)"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="form-input"
            >
              <option value="">Select College</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="auth-button">
            Signup
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <p className="auth-footer">
          Teacher?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/teacher/signup")}
          >
            Teacher Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
