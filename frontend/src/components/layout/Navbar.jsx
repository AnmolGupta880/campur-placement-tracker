import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // clear context + localStorage
    navigate("/login");    // redirect
  };

  return (
    <nav
      style={{
        height: "70px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <h3 style={{ 
        margin: 0, 
        fontSize: "24px", 
        fontWeight: 700,
        background: "linear-gradient(135deg, #fff 0%, #e0e7ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        🎓 Campus Placement Tracker
      </h3>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "14px", opacity: 0.9 }}>
            {user.name} ({user.userType === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;