import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanies, applyToCompany, getApplications, getStudentProfile } from "../../../services/api";
import "./CompanyDetails.css";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, applicationsData, profileData] = await Promise.all([
          getCompanies(),
          getApplications(),
          getStudentProfile().catch(() => null),
        ]);

        const foundCompany = companiesData.find((c) => c._id === id);
        setCompany(foundCompany);
        setStudentProfile(profileData);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      
      // Check file type (PDF only)
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setResume(reader.result); // Base64 string
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    const isEligible = studentProfile?.isEligible ?? false;
    
    if (!isEligible) {
      alert("You are not eligible to apply. You need a CGPA of 7.0 or higher.");
      return;
    }

    if (!resume) {
      const confirm = window.confirm("No resume uploaded. Continue without resume?");
      if (!confirm) return;
    }

    setUploading(true);
    try {
      await applyToCompany(id, resume, resumeFileName);
      setIsApplied(true);
      alert("Application submitted successfully!");
      setResume(null);
      setResumeFileName("");
    } catch (error) {
      alert(error.message || "Failed to apply");
    } finally {
      setUploading(false);
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

        {studentProfile && !studentProfile.isEligible && (
          <div className="eligibility-warning" style={{ 
            background: "#fee2e2", 
            borderLeft: "4px solid #dc2626", 
            padding: "16px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <p style={{ margin: 0, color: "#991b1b" }}>
              <strong>⚠️ Not Eligible:</strong> You need a CGPA of 7.0 or higher to apply for placements. 
              Your current CGPA: {studentProfile.cgpa || "N/A"}
            </p>
          </div>
        )}

        <div className="action-section">
          {!isApplied && (
            <div className="resume-upload-section">
              <label className="resume-upload-label">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="resume-input"
                />
                <span className="resume-upload-btn">
                  📄 {resumeFileName || "Upload Resume (PDF)"}
                </span>
              </label>
              {resumeFileName && (
                <span className="resume-file-name">✓ {resumeFileName}</span>
              )}
            </div>
          )}
          
          <button
            className={`apply-button ${isApplied ? "applied" : ""}`}
            onClick={handleApply}
            disabled={isApplied || uploading || !studentProfile?.isEligible}
          >
            {uploading ? "Applying..." : isApplied ? "✓ Applied" : 
             !studentProfile?.isEligible ? "Not Eligible" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;

