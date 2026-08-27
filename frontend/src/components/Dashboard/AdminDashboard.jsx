import React, { useState, useEffect } from "react";
import "../../styles/AdminDashboard.css";

import NotificationBell from "../Shared/NotificationBell";
import DragDropUpload from "../Shared/DragDropUpload";

import {
  getGrievancesByUniversity,
  assignOfficerToGrievance,
  getNotificationsForUser,
  markNotificationAsReadInStore,
  clearNotificationsInStore,
} from "../../utils/grievanceStore";

import { downloadAdminAnalysisPDF } from "../../utils/pdfReportUtil";

const AdminDashboard = ({ user }) => {
  const universityName = user?.university || user?.college || "OUTR University";
  const adminEmail = user?.email || "admin@gmail.com";

  const [activeTab, setActiveTab] = useState("monitor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterRole, setFilterRole] = useState("All");

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  const reloadNotifications = () => {
    setNotifications(getNotificationsForUser(adminEmail, universityName));
  };

  useEffect(() => {
    reloadNotifications();
  }, [adminEmail, universityName]);

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsReadInStore(id);
    setNotifications(updated.filter((n) => n.recipientKey === adminEmail || n.recipientKey === "admin@gmail.com"));
  };

  const handleClearAllNotifications = () => {
    const updated = clearNotificationsInStore(adminEmail);
    setNotifications(updated.filter((n) => n.recipientKey === adminEmail || n.recipientKey === "admin@gmail.com"));
  };

  // Profile & Avatar State
  const [userName, setUserName] = useState(user?.name || user?.email || "Super Admin");
  const [customPic, setCustomPic] = useState(null);
  const [userAvatar] = useState("⚡");

  const [showPicViewerModal, setShowPicViewerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // University Scoped Grievance List State
  const [allGrievances, setAllGrievances] = useState([]);

  const reloadGrievances = () => {
    const uniGrievances = getGrievancesByUniversity(universityName);
    setAllGrievances(uniGrievances);
  };

  useEffect(() => {
    reloadGrievances();
  }, [universityName]);

  const [alertMsg, setAlertMsg] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("grms_role");
    localStorage.removeItem("grms_user");
    window.location.reload();
  };

  const handleSaveProfileModal = (e) => {
    e.preventDefault();
    setUserName(tempName);
    setShowEditProfileModal(false);
  };

  // Admin Officer Assignment / Status Override
  const handleAssignOfficer = (id, officerName) => {
    assignOfficerToGrievance(id, officerName);
    reloadGrievances();
    reloadNotifications();
    setAlertMsg(`Officer '${officerName}' assigned to Grievance ${id} successfully!`);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleStatClick = (status) => {
    setStatusFilter((prev) => (prev === status ? "All" : status));
    setActiveTab("monitor");
  };

  const handleDownloadAnalysisPDF = () => {
    downloadAdminAnalysisPDF(
      universityName,
      {
        total: totalGrievances,
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      },
      allGrievances
    );
  };

  const firstName = userName ? userName.trim().split(" ")[0] : "Admin";
  const todayFormattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const uniId = user?.universityId || "OUTR1981";
  const lastLogin = user?.lastLogin || new Date().toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const filteredGrievances = allGrievances.filter((g) => {
    const matchesRole = filterRole === "All" ? true : g.role === filterRole;
    const matchesStatus = statusFilter === "All" ? true : g.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  const totalGrievances = allGrievances.length;
  const pendingCount = allGrievances.filter((g) => g.status === "Pending").length;
  const inProgressCount = allGrievances.filter((g) => g.status === "In Progress").length;
  const resolvedCount = allGrievances.filter((g) => g.status === "Resolved").length;

  return (
    <div className="admin-dashboard">
      <header className="admin-header-bar">
        <div className="header-left-section">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)} title="Open Sidebar Menu">
            ☰
          </button>
          <div className="header-brand">
            <h1>Welcome, {firstName}!</h1>
            <p>{todayFormattedDate} • {universityName} Admin Desk</p>
          </div>
        </div>

        <div className="header-right-actions">
          <NotificationBell
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAllNotifications}
          />
        </div>
      </header>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Admin Navigation</h3>
              <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>✖</button>
            </div>

            <div className="sidebar-body">
              <div className="profile-summary-box">
                <div
                  className="avatar-clickable"
                  title="Click to view enlarged profile picture"
                  onClick={() => setShowPicViewerModal(true)}
                >
                  {customPic ? (
                    <img src={customPic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    userAvatar
                  )}
                </div>

                <strong style={{ fontSize: "1.1rem", color: "#0369a1", display: "block" }}>{userName}</strong>
                <small className="last-login-tag">🕒 Last Login: {lastLogin}</small>

                <button
                  className="edit-profile-trigger-btn"
                  onClick={() => {
                    setTempName(userName);
                    setShowEditProfileModal(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>

              <div className="sidebar-nav-links">
                <button
                  className={`sidebar-link ${activeTab === "monitor" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("monitor");
                    setIsSidebarOpen(false);
                  }}
                >
                  Grievance Monitor & Officer Assignment
                </button>
                <button
                  className={`sidebar-link ${activeTab === "analytics" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("analytics");
                    setIsSidebarOpen(false);
                  }}
                >
                  Report Analysis & PDF Export
                </button>
                <button
                  className={`sidebar-link ${activeTab === "users" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("users");
                    setIsSidebarOpen(false);
                  }}
                >
                  University Officer Directory
                </button>
              </div>
            </div>

            <div className="sidebar-footer">
              <button className="sidebar-logout-btn" onClick={handleLogout}>
                Logout Account
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-container">
        {/* Stat Cards */}
        <div className="stats-grid">
          <div className={`stat-card ${statusFilter === "All" ? "active-filter" : ""}`} onClick={() => handleStatClick("All")}>
            <div className="stat-details">
              <h4>Total University Complaints</h4>
              <span>{totalGrievances}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "Pending" ? "active-filter" : ""}`} onClick={() => handleStatClick("Pending")}>
            <div className="stat-details">
              <h4>Pending Assignment</h4>
              <span>{pendingCount}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "In Progress" ? "active-filter" : ""}`} onClick={() => handleStatClick("In Progress")}>
            <div className="stat-details">
              <h4>In Progress by Officer</h4>
              <span>{inProgressCount}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "Resolved" ? "active-filter" : ""}`} onClick={() => handleStatClick("Resolved")}>
            <div className="stat-details">
              <h4>Solved Complaints</h4>
              <span>{resolvedCount}</span>
            </div>
          </div>
        </div>

        {alertMsg && (
          <div className="alert-banner success" style={{ marginBottom: "20px", background: "#f0fdf4", color: "#166534", padding: "12px 18px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
            ✅ {alertMsg}
          </div>
        )}

        {/* Tab 1: Grievances Monitor & Officer Assignment */}
        {activeTab === "monitor" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>
                {statusFilter === "All"
                  ? `${universityName} Complaints Monitor`
                  : `Filtered Complaints: ${statusFilter}`}
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Filter Role:</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="action-select-dark"
                >
                  <option value="All">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Teaching Staff">Teaching Staff</option>
                  <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                </select>
                {statusFilter !== "All" && (
                  <button className="action-btn-edit" onClick={() => setStatusFilter("All")}>
                    Show All
                  </button>
                )}
              </div>
            </div>

            <div className="grievance-table-wrapper">
              <table className="grievance-table-custom">
                <thead>
                  <tr>
                    <th>Grievance ID</th>
                    <th>User & Role</th>
                    <th>Category & Title</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Assign University Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.length > 0 ? (
                    filteredGrievances.map((g) => (
                      <tr key={g.id}>
                        <td><strong>{g.id}</strong></td>
                        <td>
                          <strong>{g.raisedBy || g.userName || "User"}</strong><br />
                          <small style={{ color: "#0284c7" }}>[{g.role || "User"}]</small>
                        </td>
                        <td>
                          <strong>{g.title || g.subject}</strong><br />
                          <small style={{ color: "#64748b" }}>{g.category}</small>
                        </td>
                        <td>{g.department || "General"}</td>
                        <td>
                          <span className={`badge ${g.status === "In Progress" ? "assigned" : g.status.toLowerCase().replace(" ", "-")}`}>
                            {g.status === "In Progress" ? "Assigned" : g.status}
                          </span>
                        </td>
                        <td>
                          {g.status === "Resolved" ? (
                            <span style={{ color: "#166534", fontWeight: "bold", fontSize: "0.85rem" }}>
                              ✓ Solved by {g.assignedOfficer || "Officer"}
                            </span>
                          ) : (
                            <select
                              value={g.assignedOfficer || ""}
                              onChange={(e) => handleAssignOfficer(g.id, e.target.value)}
                              className="action-select-dark"
                            >
                              <option value="">-- Hire / Assign Officer --</option>
                              <option value="Officer 1">Officer 1 (Academic Desk)</option>
                              <option value="Officer 2">Officer 2 (Infrastructure Desk)</option>
                              <option value="Officer 3">Officer 3 (Hostel & Facilities Desk)</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No grievances found matching selected filters for {universityName}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Report Analysis & PDF Export */}
        {activeTab === "analytics" && (
          <div className="card-panel">
            <div className="panel-header">
              <div>
                <h3>{universityName} Report Analysis</h3>
                <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Detailed breakdown of complaint resolution metrics & export report as PDF
                </p>
              </div>

              <button className="download-report-btn" onClick={handleDownloadAnalysisPDF}>
                📥 Download Report (PDF)
              </button>
            </div>

            <div className="stats-grid" style={{ marginTop: "16px" }}>
              <div className="stat-card" style={{ background: "#f0f9ff" }}>
                <h4>Total Complaints Logged</h4>
                <span>{totalGrievances}</span>
              </div>
              <div className="stat-card" style={{ background: "#fef2f2" }}>
                <h4>Pending Complaints</h4>
                <span style={{ color: "#dc2626" }}>{pendingCount}</span>
              </div>
              <div className="stat-card" style={{ background: "#fef9c3" }}>
                <h4>In Progress Complaints</h4>
                <span style={{ color: "#ca8a04" }}>{inProgressCount}</span>
              </div>
              <div className="stat-card" style={{ background: "#f0fdf4" }}>
                <h4>Solved Complaints</h4>
                <span style={{ color: "#166534" }}>{resolvedCount}</span>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ color: "#0369a1", marginBottom: "12px" }}>Category Breakdown Summary</h4>
              <div className="grievance-table-wrapper">
                <table className="grievance-table-custom">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Lodged</th>
                      <th>Pending</th>
                      <th>In Progress</th>
                      <th>Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Academic", "Hostel", "Infrastructure", "Faculty", "Other"].map((cat) => {
                      const catItems = allGrievances.filter((g) => g.category === cat);
                      return (
                        <tr key={cat}>
                          <td><strong>{cat}</strong></td>
                          <td>{catItems.length}</td>
                          <td style={{ color: "#dc2626" }}>{catItems.filter((g) => g.status === "Pending").length}</td>
                          <td style={{ color: "#ca8a04" }}>{catItems.filter((g) => g.status === "In Progress").length}</td>
                          <td style={{ color: "#166534", fontWeight: "bold" }}>{catItems.filter((g) => g.status === "Resolved").length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: University Officer Directory */}
        {activeTab === "users" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>{universityName} Registered Staff & Officers</h3>
            </div>
            <div className="grievance-table-wrapper">
              <table className="grievance-table-custom">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Official User Email</th>
                    <th>Assigned Desk</th>
                    <th>Access Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge high" style={{ background: "#e0f2fe", color: "#0369a1" }}>Admin</span></td>
                    <td>{adminEmail}</td>
                    <td>University Root Oversight</td>
                    <td>Full Admin Control</td>
                  </tr>
                  <tr>
                    <td><span className="badge medium" style={{ background: "#fef9c3", color: "#a16207" }}>Officer</span></td>
                    <td>officer@gmail.com</td>
                    <td>Academic & Grievance Officer Desk</td>
                    <td>Grievance Resolution & Action</td>
                  </tr>
                  <tr>
                    <td><span className="badge low">Teaching Staff</span></td>
                    <td>teachingstaff@gmail.com</td>
                    <td>Faculty Desk</td>
                    <td>Grievance Submission</td>
                  </tr>
                  <tr>
                    <td><span className="badge low">Non-Teaching Staff</span></td>
                    <td>nonteachingstaff@gmail.com</td>
                    <td>Facility Desk</td>
                    <td>Grievance Submission</td>
                  </tr>
                  <tr>
                    <td><span className="badge low">Student</span></td>
                    <td>student@gmail.com</td>
                    <td>Student Desk</td>
                    <td>Grievance Lodging</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showPicViewerModal && (
        <div className="modal-overlay" onClick={() => setShowPicViewerModal(false)}>
          <div className="modal-dialog" style={{ width: "360px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>Admin Photo</h3>
              <button className="modal-dialog-close" onClick={() => setShowPicViewerModal(false)}>✖</button>
            </div>
            <div className="modal-dialog-body">
              <div style={{ width: "180px", height: "180px", borderRadius: "50%", margin: "0 auto 16px auto", overflow: "hidden", border: "4px solid #0284c7", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem" }}>
                {customPic ? <img src={customPic} alt="Profile Enlarged" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userAvatar}
              </div>
              <strong style={{ fontSize: "1.2rem", color: "#0369a1" }}>{userName}</strong>
            </div>
          </div>
        </div>
      )}

      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal-dialog" style={{ width: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>Edit Admin Details</h3>
              <button className="modal-dialog-close" onClick={() => setShowEditProfileModal(false)}>✖</button>
            </div>
            <div className="modal-dialog-body">
              <form onSubmit={handleSaveProfileModal}>
                <div className="form-group-custom">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-custom">
                  <label>Upload New Admin Photo</label>
                  <DragDropUpload
                    onFileSelected={(file) => console.log("Admin photo selected:", file)}
                    accept="image/*"
                  />
                </div>

                <button type="submit" className="modal-submit-btn">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
