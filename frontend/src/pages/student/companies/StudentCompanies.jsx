import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentCompanies.css";
import {
  getCompanies,
  getApplications,
  applyToCompany,
  getStudentProfile,
} from "../../../services/api";

const StudentCompanies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, ctc, date
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [showResumeModal, setShowResumeModal] = useState(false);

  // 🔹 Fetch companies + applications + profile together
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, applicationsData, profileData] = await Promise.all([
          getCompanies(),
          getApplications(),
          getStudentProfile().catch(() => null), // Profile might fail, continue anyway
        ]);

        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setStudentProfile(profileData);
      } catch (err) {
        console.error(err);
        setError("Failed to load companies/applications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Get list of company IDs already applied
  const appliedCompanyIds = applications.map(
    (app) => app.company?._id || app.company
  );

  // 🔹 Check if student is eligible
  const isEligible = studentProfile?.isEligible ?? false;

  // 🔹 Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter((company) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name?.toLowerCase().includes(searchLower) ||
        company.role?.toLowerCase().includes(searchLower) ||
        company.ctc?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "ctc":
          const ctcA = parseFloat(a.ctc?.match(/(\d+\.?\d*)/)?.[1] || 0);
          const ctcB = parseFloat(b.ctc?.match(/(\d+\.?\d*)/)?.[1] || 0);
          return ctcB - ctcA;
        case "date":
          const dateA = a.driveDate ? new Date(a.driveDate) : new Date(0);
          const dateB = b.driveDate ? new Date(b.driveDate) : new Date(0);
          return dateA - dateB;
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

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

  const handleApplyClick = (companyId) => {
    if (!isEligible) {
      alert("You are not eligible to apply. You need a CGPA of 7.0 or higher.");
      return;
    }
    setSelectedCompany(companyId);
    setShowResumeModal(true);
  };

  // 🔹 Handle Apply click
  const handleApply = async () => {
    if (!selectedCompany) return;

    if (!resume) {
      const confirm = window.confirm("No resume uploaded. Continue without resume?");
      if (!confirm) {
        setShowResumeModal(false);
        return;
      }
    }

    try {
      await applyToCompany(selectedCompany, resume, resumeFileName);

      // 🔁 Re-fetch applications after apply
      const updatedApplications = await getApplications();
      setApplications(updatedApplications);
      
      setShowResumeModal(false);
      setResume(null);
      setResumeFileName("");
      setSelectedCompany(null);
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.message || "Failed to apply");
    }
  };

  if (loading) {
    return (
      <div className="companies-page">
        <p>Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-page">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="companies-page">
      <h2 className="companies-title">Available Companies</h2>
      <p className="companies-subtitle">
        Apply to companies visiting your campus
      </p>

      {!isEligible && (
        <div className="eligibility-warning">
          <p>
            <strong>⚠️ Not Eligible:</strong> You need a CGPA of 7.0 or higher
            to apply for placements. Your current CGPA: {studentProfile?.cgpa || "N/A"}
          </p>
        </div>
      )}

      <div className="companies-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search companies, roles, or CTC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-box">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="ctc">CTC (High to Low)</option>
            <option value="date">Drive Date</option>
          </select>
        </div>
      </div>

      {companies.length === 0 ? (
        <p>No companies available</p>
      ) : filteredAndSortedCompanies.length === 0 ? (
        <p>No companies match your search</p>
      ) : (
        <div className="companies-grid">
          {filteredAndSortedCompanies.map((company) => {
            const isApplied = appliedCompanyIds.includes(company._id);

            return (
              <div
                className={`company-card ${!isEligible ? "disabled" : ""}`}
                key={company._id}
                onClick={() => navigate(`/student/companies/${company._id}`)}
              >
                <h3 className="company-name">{company.name}</h3>
                <p className="company-role">Role: {company.role}</p>
                <p className="company-ctc">CTC: {company.ctc}</p>
                {company.driveDate && (
                  <p className="company-date">
                    📅 Drive: {new Date(company.driveDate).toLocaleDateString()}
                  </p>
                )}
                {company.eligibility && (
                  <p className="company-eligibility">
                    Eligibility: {company.eligibility}
                  </p>
                )}

                <div className="card-actions">
                  <button
                    className={`apply-btn ${isApplied ? "applied" : ""} ${
                      !isEligible ? "disabled" : ""
                    }`}
                    disabled={isApplied || !isEligible}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyClick(company._id);
                    }}
                  >
                    {isApplied
                      ? "Applied"
                      : !isEligible
                      ? "Not Eligible"
                      : "Apply"}
                  </button>
                  <button
                    className="view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student/companies/${company._id}`);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="resume-modal-overlay" onClick={() => setShowResumeModal(false)}>
          <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Upload Resume</h3>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowResumeModal(false);
                  setResume(null);
                  setResumeFileName("");
                }}
              >
                ×
              </button>
            </div>
            <div className="resume-modal-body">
              <label className="resume-upload-label-modal">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="resume-input"
                />
                <div className="resume-upload-area">
                  <span className="upload-icon">📄</span>
                  <span className="upload-text">
                    {resumeFileName || "Click to upload resume (PDF, Max 5MB)"}
                  </span>
                </div>
              </label>
              {resumeFileName && (
                <div className="resume-preview">
                  <span className="resume-file-name">✓ {resumeFileName}</span>
                </div>
              )}
              <div className="resume-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowResumeModal(false);
                    setResume(null);
                    setResumeFileName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={handleApply}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCompanies;