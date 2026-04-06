import React from "react";
import "../../styles/TertiaryDashboard.css";

const TertiaryDashboard = ({ user }) => {
  return (
    <div className="tertiary-dashboard">
      <header className="dashboard-header">
        <h2>Welcome, {user.firstName}</h2>
        <button className="logout-btn">Logout</button>
      </header>
      <main className="dashboard-content">
        <div className="card">Submit Grievance</div>
        <div className="card">Track Grievances</div>
        <div className="card">Notifications</div>
        <div className="card">Reports</div>
        <div className="card">Profile</div>
      </main>
    </div>
  );
};

export default TertiaryDashboard;
