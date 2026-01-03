import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanies, applyToCompany, getApplications } from "../../../services/api";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, applicationsData] = await Promise.all([
          getCompanies(),
          getApplications(),
        ]);

        const foundCompany = companiesData.find((c) => c._id === id);
        setCompany(foundCompany);

        const applied = applicationsData.some(
          (app) => app.company?._id === id || app.company === id
        );
        setIsApplied(applied);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApply = async () => {
    try {
      await applyToCompany(id);
      setIsApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      alert(error.message || "Failed to apply");
    }
  };

  if (loading) {
    return <div className="company-details">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="company-details">
        <p>Company not found</p>
        <button onClick={() => navigate("/student/companies")}>Back</button>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "TBA";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="company-details">
      <button className="back-btn" onClick={() => navigate("/student/companies")}>
        ← Back to Companies
      </button>

      <div className="company-details-card">
        <div className="company-header">
          <h1>{company.name}</h1>
          <span className="company-badge">Active</span>
        </div>

        <div className="company-info-grid">
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value">{company.role || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">CTC</span>
            <span className="info-value ctc-highlight">{company.ctc || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Drive Date</span>
            <span className="info-value">{formatDate(company.driveDate)}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{company.location || "On Campus"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">College</span>
            <span className="info-value">{company.college?.name || "N/A"}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Application Status</span>
            <span className={`status-badge ${isApplied ? "applied" : "not-applied"}`}>
              {isApplied ? "Applied" : "Not Applied"}
            </span>
          </div>
        </div>

        {company.eligibility && (
          <div className="eligibility-section">
            <h3>Eligibility Criteria</h3>
            <p>{company.eligibility}</p>
          </div>
        )}

        {company.description && (
          <div className="description-section">
            <h3>About the Company</h3>
            <p>{company.description}</p>
          </div>
        )}

        {company.website && (
          <div className="website-section">
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              Visit Company Website →
            </a>
          </div>
        )}

        <div className="action-section">
          <button
            className={`apply-button ${isApplied ? "applied" : ""}`}
            onClick={handleApply}
            disabled={isApplied}
          >
            {isApplied ? "✓ Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;

