import { getTeacherStudents } from "../../../services/api";

export const exportToCSV = async () => {
  try {
    const students = await getTeacherStudents();

    // Prepare CSV data
    const headers = [
      "Name",
      "Email",
      "College",
      "CGPA",
      "Eligibility",
      "Applications Count",
    ];

    const rows = students.map((student) => [
      student.name,
      student.email,
      student.college?.name || "N/A",
      student.cgpa,
      student.isEligible ? "Eligible" : "Not Eligible",
      student.applicationsCount || 0,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
    alert("Failed to export data");
  }
};

export const exportToJSON = async () => {
  try {
    const students = await getTeacherStudents();

    const dataStr = JSON.stringify(students, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
    alert("Failed to export data");
  }
};

