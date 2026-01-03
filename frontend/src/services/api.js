const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token
    ? { Authorization: `Bearer ${user.token}` }
    : {};
};

/* ================= AUTH ================= */

export const signup = async (data) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const loginTeacher = async (data) => {
  const res = await fetch(`${API_URL}/auth/teacher/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const signupTeacher = async (data) => {
  const res = await fetch(`${API_URL}/auth/teacher/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

export const getTeacherStudents = async () => {
  const res = await fetch(`${API_URL}/teacher/students`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const getTeacherStats = async () => {
  const res = await fetch(`${API_URL}/teacher/stats`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

export const getStudentProfile = async () => {
  const res = await fetch(`${API_URL}/students/profile`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

/* ================= COLLEGES ================= */

export const getColleges = async () => {
  const res = await fetch(`${API_URL}/colleges`);
  if (!res.ok) throw new Error("Failed to fetch colleges");
  return res.json();
};

/* ================= COMPANIES ================= */

export const getCompanies = async () => {
  const res = await fetch(`${API_URL}/companies`);
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
};

export const createCompany = async (companyData) => {
  const res = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companyData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create company");
  }

  return res.json();
};

export const bulkCreateCompanies = async (companiesArray) => {
  const res = await fetch(`${API_URL}/companies/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(companiesArray),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create companies");
  }

  return res.json();
};

/* ================= APPLICATIONS ================= */

export const getApplications = async () => {
  const res = await fetch(`${API_URL}/applications`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
};

export const applyToCompany = async (companyId) => {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ companyId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Apply failed");
  }

  return res.json();
};

export const getAllApplications = async () => {
  const res = await fetch(`${API_URL}/applications/all`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
};

export const updateApplicationStatus = async (applicationId, status) => {
  const res = await fetch(`${API_URL}/applications/${applicationId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update status");
  }

  return res.json();
};