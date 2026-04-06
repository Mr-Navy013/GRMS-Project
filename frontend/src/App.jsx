import React, { useState } from "react";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import OfficerDashboard from "./components/Dashboard/OfficerDashboard";
import TertiaryDashboard from "./components/Dashboard/TertiaryDashboard";

const App = () => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState({ firstName: "John" }); // mock user

  // arrow function for login success
  const handleLoginSuccess = (selectedRole) => {
    setRole(selectedRole);
  };

  // agar role empty hai to WelcomePage dikhao
  if (!role) {
    return <WelcomePage onLoginSuccess={handleLoginSuccess} />;
  }

  // role ke hisaab se dashboard render karo
  return (
    <>
      {role === "Admin" && <AdminDashboard user={user} />}
      {role === "Officer" && <OfficerDashboard user={user} />}
      {role !== "Admin" && role !== "Officer" && <TertiaryDashboard user={user} />}
    </>
  );
};

export default App;
