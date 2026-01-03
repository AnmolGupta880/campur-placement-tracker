import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./StudentApplications.css";
import { getApplications } from "../../../services/api";

const StudentApplications = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response");
        }

        setApplications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [location.pathname]);

  const shortlistedCount = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  if (loading) {
    return (
      <div className="applications-page">
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <h2 className="applications-title">My Applications</h2>
      <p className="applications-subtitle">
        Track your placement application status
      </p>

      {shortlistedCount > 0 && (
        <div className="shortlisted-banner">
          <span className="banner-icon">🎉</span>
          <div>
            <strong>Congratulations!</strong> You have been shortlisted for{" "}
            {shortlistedCount} interview{shortlistedCount > 1 ? "s" : ""}!
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="no-applications">
          <p>No applications yet. Start applying to companies!</p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div
              key={app._id}
              className={`application-card ${
                app.status?.toLowerCase() === "shortlisted" ? "shortlisted" : ""
              }`}
            >
              <div className="card-header">
                <h3 className="company-name">{app.company?.name || "N/A"}</h3>
                <span className={`status-badge ${app.status?.toLowerCase()}`}>
                  {app.status || "Applied"}
                </span>
              </div>

              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Role:</span>
                  <span className="detail-value">{app.company?.role || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">CTC:</span>
                  <span className="detail-value ctc-value">
                    {app.company?.ctc || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied On:</span>
                  <span className="detail-value">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {app.status === "Shortlisted" && (
                <div className="shortlisted-message">
                  <span className="message-icon">✓</span>
                  <span>You've been shortlisted for an interview!</span>
                </div>
              )}

              {app.status === "Rejected" && (
                <div className="rejected-message">
                  <span className="message-icon">✗</span>
                  <span>Application not selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;