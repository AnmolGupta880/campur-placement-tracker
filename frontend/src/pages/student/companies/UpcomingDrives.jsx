import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompanies, getApplications } from "../../../services/api";
import "./UpcomingDrives.css";

const UpcomingDrives = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, applicationsData] = await Promise.all([
          getCompanies(),
          getApplications(),
        ]);

        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const appliedCompanyIds = applications.map(
    (app) => app.company?._id || app.company
  );

  // Filter companies with drive dates and sort by date
  const upcomingDrives = companies
    .filter((company) => company.driveDate && new Date(company.driveDate) >= new Date())
    .sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate))
    .slice(0, 10); // Show next 10 drives

  const formatDate = (date) => {
    if (!date) return "TBA";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysUntil = (date) => {
    if (!date) return null;
    const today = new Date();
    const driveDate = new Date(date);
    const diffTime = driveDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="upcoming-drives">Loading...</div>;
  }

  return (
    <div className="upcoming-drives">
      <h2 className="drives-title">📅 Upcoming Placement Drives</h2>
      <p className="drives-subtitle">Next 10 scheduled placement drives</p>

      {upcomingDrives.length === 0 ? (
        <div className="no-drives">
          <p>No upcoming drives scheduled</p>
        </div>
      ) : (
        <div className="drives-list">
          {upcomingDrives.map((company) => {
            const daysUntil = getDaysUntil(company.driveDate);
            const isApplied = appliedCompanyIds.includes(company._id);

            return (
              <div
                key={company._id}
                className="drive-card"
                onClick={() => navigate(`/student/companies/${company._id}`)}
              >
                <div className="drive-date-section">
                  <div className="date-circle">
                    <span className="date-day">
                      {new Date(company.driveDate).getDate()}
                    </span>
                    <span className="date-month">
                      {new Date(company.driveDate).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  {daysUntil !== null && (
                    <div className="days-until">
                      {daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : `${daysUntil} days`}
                    </div>
                  )}
                </div>

                <div className="drive-info">
                  <h3 className="drive-company-name">{company.name}</h3>
                  <p className="drive-role">{company.role}</p>
                  <p className="drive-ctc">💰 {company.ctc}</p>
                  {isApplied && (
                    <span className="applied-badge">✓ Applied</span>
                  )}
                </div>

                <button
                  className="view-company-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/companies/${company._id}`);
                  }}
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingDrives;

