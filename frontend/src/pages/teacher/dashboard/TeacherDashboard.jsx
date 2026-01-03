import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./TeacherDashboard.css";
import { getTeacherStudents, getTeacherStats } from "../../../services/api";
import { exportToCSV, exportToJSON } from "./ExportData";

const TeacherDashboard = () => {
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    eligibleStudents: 0,
    nonEligibleStudents: 0,
    totalApplications: 0,
    totalCompanies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, eligible, non-eligible

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, statsData] = await Promise.all([
          getTeacherStudents(),
          getTeacherStats(),
        ]);

        setStudents(Array.isArray(studentsData) ? studentsData : []);
        setStats(statsData || stats);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.pathname]);

  const filteredStudents =
    filter === "all"
      ? students
      : filter === "eligible"
      ? students.filter((s) => s.isEligible)
      : students.filter((s) => !s.isEligible);

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <h2 className="dashboard-title">Teacher Dashboard</h2>
      <p className="dashboard-subtitle">View and manage all students</p>

      <div className="stats-container">
        <div className="stat-card">
          <p className="stat-title">Total Students</p>
          <h3 className="stat-value">{stats.totalStudents}</h3>
        </div>

        <div className="stat-card eligible">
          <p className="stat-title">Eligible Students</p>
          <h3 className="stat-value">{stats.eligibleStudents}</h3>
        </div>

        <div className="stat-card non-eligible">
          <p className="stat-title">Non-Eligible</p>
          <h3 className="stat-value">{stats.nonEligibleStudents}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">Total Applications</p>
          <h3 className="stat-value">{stats.totalApplications}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">Total Companies</p>
          <h3 className="stat-value">{stats.totalCompanies}</h3>
        </div>
      </div>

      <div className="controls-section">
        <div className="filter-section">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Students
          </button>
          <button
            className={`filter-btn ${filter === "eligible" ? "active" : ""}`}
            onClick={() => setFilter("eligible")}
          >
            Eligible
          </button>
          <button
            className={`filter-btn ${filter === "non-eligible" ? "active" : ""}`}
            onClick={() => setFilter("non-eligible")}
          >
            Non-Eligible
          </button>
        </div>

        <div className="export-section">
          <button className="export-btn" onClick={exportToCSV}>
            📥 Export CSV
          </button>
          <button className="export-btn" onClick={exportToJSON}>
            📥 Export JSON
          </button>
        </div>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>CGPA</th>
              <th>Eligibility</th>
              <th>Applications</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.college?.name || "N/A"}</td>
                  <td>{student.cgpa}</td>
                  <td>
                    <span
                      className={`eligibility-badge ${
                        student.isEligible ? "eligible" : "non-eligible"
                      }`}
                    >
                      {student.isEligible ? "Eligible" : "Not Eligible"}
                    </span>
                  </td>
                  <td>{student.applicationsCount || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;

