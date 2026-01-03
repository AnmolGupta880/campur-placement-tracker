import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  const isTeacher = user?.userType === "teacher";

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">
        {isTeacher ? "👨‍🏫 Teacher Panel" : "👨‍🎓 Student Panel"}
      </h3>

      <nav className="sidebar-nav">
        {isTeacher ? (
          <>
            <NavLink to="/teacher/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>
            <NavLink to="/teacher/shortlist" className="sidebar-link">
              Shortlist Students
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/student/dashboard" className="sidebar-link">
              Dashboard
            </NavLink>

            <NavLink to="/student/companies" className="sidebar-link">
              Companies
            </NavLink>

            <NavLink to="/student/applications" className="sidebar-link">
              Applications
            </NavLink>

            <NavLink to="/student/profile" className="sidebar-link">
              Profile
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
