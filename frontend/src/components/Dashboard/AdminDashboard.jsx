import React from "react";
import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2>Admin Control Panel - {user.firstName}</h2>
        <button className="logout-btn">Logout</button>
      </header>
      <nav className="admin-nav">
        <ul>
          <li>📊 Dashboard</li>
          <li>📝 Manage Grievances</li>
          <li>👥 Manage Users</li>
          <li>📑 Reports</li>
          <li>⚙️ Settings</li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <div className="panel">Grievance List</div>
        <div className="panel">Deactivated Users</div>
        <div className="panel">System Analytics</div>
        <div className="panel">Notifications</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
