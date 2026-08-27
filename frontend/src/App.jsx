import React, { useState } from "react";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import OfficerDashboard from "./components/Dashboard/OfficerDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import TeachingStaffDashboard from "./components/Dashboard/TeachingStaffDashboard";
import NonTeachingStaffDashboard from "./components/Dashboard/NonTeachingStaffDashboard";
import TertiaryDashboard from "./components/Dashboard/TertiaryDashboard";

const App = () => {
  const [role, setRole] = useState(() => localStorage.getItem("grms_role") || "");
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("grms_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLoginSuccess = (selectedRole, userData) => {
    const formattedDate = new Date().toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const userObjWithLogin = {
      ...userData,
      lastLogin: formattedDate
    };

    setRole(selectedRole);
    setUser(userObjWithLogin);

    localStorage.setItem("grms_role", selectedRole);
    localStorage.setItem("grms_user", JSON.stringify(userObjWithLogin));
  };

  if (!role || !user) {
    return <WelcomePage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      {role === "Admin" && <AdminDashboard user={user} />}
      {role === "Officer" && <OfficerDashboard user={user} />}
      {role === "Student" && <StudentDashboard user={user} />}
      {role === "Teaching Staff" && <TeachingStaffDashboard user={user} />}
      {role === "Non-Teaching Staff" && <NonTeachingStaffDashboard user={user} />}
      {role !== "Admin" &&
        role !== "Officer" &&
        role !== "Student" &&
        role !== "Teaching Staff" &&
        role !== "Non-Teaching Staff" && <TertiaryDashboard user={user} />}
    </>
  );
};

export default App;
