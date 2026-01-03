import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ShortlistStudents.css";
import { getAllApplications, updateApplicationStatus } from "../../../services/api";

const ShortlistStudents = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, applied, shortlisted, rejected

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getAllApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [location.pathname]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      
      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? updated : app))
      );
    } catch (error) {
      alert(error.message || "Failed to update status");
    }
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status?.toLowerCase() === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    shortlisted: applications.filter((app) => app.status === "Shortlisted").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  if (loading) {
    return (
      <div className="shortlist-page">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="shortlist-page">
      <h2 className="page-title">Shortlist Students for Interviews</h2>
      <p className="page-subtitle">Review and manage student applications</p>

      <div className="stats-cards">
        <div className="stat-card">
          <p className="stat-label">Total Applications</p>
          <h3 className="stat-number">{stats.total}</h3>
        </div>
        <div className="stat-card applied">
          <p className="stat-label">Applied</p>
          <h3 className="stat-number">{stats.applied}</h3>
        </div>
        <div className="stat-card shortlisted">
          <p className="stat-label">Shortlisted</p>
          <h3 className="stat-number">{stats.shortlisted}</h3>
        </div>
        <div className="stat-card rejected">
          <p className="stat-label">Rejected</p>
          <h3 className="stat-number">{stats.rejected}</h3>
        </div>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({stats.total})
        </button>
        <button
          className={`filter-btn ${filter === "applied" ? "active" : ""}`}
          onClick={() => setFilter("applied")}
        >
          Applied ({stats.applied})
        </button>
        <button
          className={`filter-btn ${filter === "shortlisted" ? "active" : ""}`}
          onClick={() => setFilter("shortlisted")}
        >
          Shortlisted ({stats.shortlisted})
        </button>
        <button
          className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      <div className="applications-container">
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found</p>
          </div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>CGPA</th>
                <th>Company</th>
                <th>Role</th>
                <th>CTC</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id}>
                  <td>{app.student?.name || "N/A"}</td>
                  <td>{app.student?.email || "N/A"}</td>
                  <td>{app.student?.cgpa || "N/A"}</td>
                  <td>{app.company?.name || "N/A"}</td>
                  <td>{app.company?.role || "N/A"}</td>
                  <td>{app.company?.ctc || "N/A"}</td>
                  <td>
                    <span className={`status-badge ${app.status?.toLowerCase()}`}>
                      {app.status || "Applied"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {app.status !== "Shortlisted" && (
                        <button
                          className="action-btn shortlist-btn"
                          onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                        >
                          ✓ Shortlist
                        </button>
                      )}
                      {app.status !== "Rejected" && (
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleStatusUpdate(app._id, "Rejected")}
                        >
                          ✗ Reject
                        </button>
                      )}
                      {app.status !== "Applied" && (
                        <button
                          className="action-btn reset-btn"
                          onClick={() => handleStatusUpdate(app._id, "Applied")}
                        >
                          ↺ Reset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShortlistStudents;

