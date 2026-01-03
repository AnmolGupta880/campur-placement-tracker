import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { getCompanies, getApplications, getStudentProfile } from "../../../services/api";

const StudentDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    eligibleCompanies: 0,
    appliedCompanies: 0,
    upcomingDrives: 0,
    averageCTC: "0 LPA",
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [companies, applications, profile] = await Promise.all([
          getCompanies(),
          getApplications(),
          getStudentProfile().catch(() => null),
        ]);

        const companiesArray = Array.isArray(companies) ? companies : [];
        const applicationsArray = Array.isArray(applications) ? applications : [];

        // Calculate eligible companies (total companies)
        const eligibleCompanies = companiesArray.length;

        // Calculate applied companies (count of applications)
        const appliedCompanies = applicationsArray.length;

        // Calculate upcoming drives (companies with future drive dates)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcomingDrives = companiesArray.filter(
          (company) =>
            company.driveDate && new Date(company.driveDate) >= today
        ).length;

        // Calculate average CTC from applied companies
        let averageCTC = "0 LPA";
        if (applicationsArray.length > 0) {
          const ctcValues = applicationsArray
            .map((app) => {
              const ctc = app.company?.ctc || "";
              // Extract numeric value from CTC string (e.g., "7.5 LPA" -> 7.5)
              const match = ctc.match(/(\d+\.?\d*)/);
              return match ? parseFloat(match[1]) : 0;
            })
            .filter((val) => val > 0);

          if (ctcValues.length > 0) {
            const sum = ctcValues.reduce((acc, val) => acc + val, 0);
            const avg = sum / ctcValues.length;
            averageCTC = `${avg.toFixed(1)} LPA`;
          }
        }

        setStats({
          eligibleCompanies,
          appliedCompanies,
          upcomingDrives,
          averageCTC,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [location.pathname]); // Refetch when route changes

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Welcome, Student</h2>
      <p className="dashboard-subtitle">
        Here's your placement overview
      </p>

      <div className="stats-container">
        <div className="stat-card" onClick={() => navigate("/student/companies")}>
          <p className="stat-title">Eligible Companies</p>
          <h3 className="stat-value">{stats.eligibleCompanies}</h3>
        </div>

        <div className="stat-card" onClick={() => navigate("/student/applications")}>
          <p className="stat-title">Applied Companies</p>
          <h3 className="stat-value">{stats.appliedCompanies}</h3>
        </div>

        <div className="stat-card" onClick={() => navigate("/student/companies")}>
          <p className="stat-title">Upcoming Drives</p>
          <h3 className="stat-value">{stats.upcomingDrives}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-title">Average CTC</p>
          <h3 className="stat-value">{stats.averageCTC}</h3>
        </div>
      </div>

      <div className="quick-actions">
        <button
          className="action-btn"
          onClick={() => navigate("/student/companies")}
        >
          Browse Companies →
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/student/applications")}
        >
          View Applications →
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
