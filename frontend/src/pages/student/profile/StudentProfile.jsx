import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getStudentProfile } from "../../../services/api";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>No profile data found</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <div className="profile-field">
          <span className="field-label">Name</span>
          <span className="field-value">{profile.name}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">Email</span>
          <span className="field-value">{profile.email}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">College</span>
          <span className="field-value">{profile.college?.name || "N/A"}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">CGPA</span>
          <span className="field-value cgpa-value">{profile.cgpa}</span>
        </div>

        <div className="profile-field">
          <span className="field-label">Eligibility Status</span>
          <span
            className={`eligibility-badge ${
              profile.isEligible ? "eligible" : "non-eligible"
            }`}
          >
            {profile.isEligible ? "✓ Eligible" : "✗ Not Eligible"}
          </span>
        </div>

        {!profile.isEligible && (
          <div className="eligibility-note">
            <p>
              <strong>Note:</strong> You need a CGPA of 7.0 or higher to be
              eligible for placements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
