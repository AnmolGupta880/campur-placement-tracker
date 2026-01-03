const API_BASE_URL = "http://localhost:5000/api";


export const getCompanies = async () => {
  const response = await fetch(`${API_BASE_URL}/companies`);
  return response.json();
};

export const getApplications = async () => {
  const response = await fetch(`${API_BASE_URL}/applications`);
  return response.json();
};