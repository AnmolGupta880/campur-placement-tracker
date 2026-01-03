import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import TeacherLogin from "./pages/auth/TeacherLogin";
import TeacherSignup from "./pages/auth/TeacherSignup";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

import StudentDashboard from "./pages/student/dashboard/StudentDashboard";
import StudentCompanies from "./pages/student/companies/StudentCompanies";
import CompanyDetails from "./pages/student/companies/CompanyDetails";
import StudentApplications from "./pages/student/applications/StudentApplications";
import StudentProfile from "./pages/student/profile/StudentProfile";

import TeacherDashboard from "./pages/teacher/dashboard/TeacherDashboard";
import ShortlistStudents from "./pages/teacher/shortlist/ShortlistStudents";

const App = () => {
  const { user, loading } = useAuth();

  // 🔹 Handle initial auth loading
  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  const isTeacher = user?.userType === "teacher";
  const isStudent = user?.userType === "student";

  return (
    <div>
      {/* Show layout ONLY when user is logged in */}
      {user && <Navbar />}

      <div style={{ display: "flex" }}>
        {user && <Sidebar />}

        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/signup" element={<TeacherSignup />} />

            {/* Student routes */}
            {isStudent && (
              <>
                <Route path="/" element={<Navigate to="/student/dashboard" />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/companies" element={<StudentCompanies />} />
                <Route path="/student/companies/:id" element={<CompanyDetails />} />
                <Route path="/student/applications" element={<StudentApplications />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </>
            )}

            {/* Teacher routes */}
            {isTeacher && (
              <>
                <Route path="/" element={<Navigate to="/teacher/dashboard" />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/shortlist" element={<ShortlistStudents />} />
              </>
            )}

            {/* Fallback */}
            <Route
              path="*"
              element={
                <Navigate
                  to={
                    user
                      ? isTeacher
                        ? "/teacher/dashboard"
                        : "/student/dashboard"
                      : "/login"
                  }
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
