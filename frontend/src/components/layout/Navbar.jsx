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
        height: "60px",
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h3>Campus Placement Tracker</h3>

      {user && (
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;