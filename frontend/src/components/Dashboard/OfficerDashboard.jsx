import React from "react";
import "../../styles/OfficerDashboard.css";

const OfficerDashboard = ({ user }) => {
  return (
    <div className="officer-dashboard">
      <header className="dashboard-header">
        <h2>Officer Panel - {user.firstName}</h2>
        <button className="logout-btn">Logout</button>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li>Dashboard</li>
          <li>Assigned Complaints</li>
          <li>Manage Status</li>
          <li>Reports</li>
          <li>Notifications</li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <div className="tile">Total Complaints: 12</div>
        <div className="tile">In Progress: 5</div>
        <div className="tile">Resolved: 6</div>
        <div className="tile">Pending: 1</div>
      </main>

      <section className="grievance-table">
        <h3>Assigned Grievances</h3>
        <table>
          <thead>
            <tr>
              <th>Grievance ID</th>
              <th>Category</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>G-0012</td>
              <td>Academic</td>
              <td>High</td>
              <td>Pending</td>
              <td><button>Update</button></td>
            </tr>
            <tr>
              <td>G-0017</td>
              <td>Technical</td>
              <td>Medium</td>
              <td>In Progress</td>
              <td><button>Update</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OfficerDashboard;
