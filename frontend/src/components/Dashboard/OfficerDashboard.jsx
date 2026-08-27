import React, { useState, useEffect } from "react";
import "../../styles/OfficerDashboard.css";

import NotificationBell from "../Shared/NotificationBell";
import DragDropUpload from "../Shared/DragDropUpload";

import {
  getGrievancesByUniversity,
  resolveGrievanceStatus,
  getNotificationsForUser,
  markNotificationAsReadInStore,
  clearNotificationsInStore,
} from "../../utils/grievanceStore";

import { downloadResolutionPDF } from "../../utils/pdfReportUtil";

const OfficerDashboard = ({ user }) => {
  const universityName = user?.university || user?.college || "OUTR University";
  const officerEmail = user?.email || "officer@gmail.com";

  const [activeTab, setActiveTab] = useState("assigned");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [notifications, setNotifications] = useState([]);

  const reloadNotifications = () => {
    setNotifications(getNotificationsForUser(officerEmail, universityName));
  };

  useEffect(() => {
    reloadNotifications();
  }, [officerEmail, universityName]);

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsReadInStore(id);
    setNotifications(updated.filter((n) => n.recipientKey === officerEmail));
  };

  const handleClearAllNotifications = () => {
    const updated = clearNotificationsInStore(officerEmail);
    setNotifications(updated.filter((n) => n.recipientKey === officerEmail));
  };

  const [userName, setUserName] = useState(user?.name || user?.email || "Officer 1");
  const [customPic, setCustomPic] = useState(null);
  const [userAvatar] = useState("🛡️");

  const [showPicViewerModal, setShowPicViewerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [assignedComplaints, setAssignedComplaints] = useState([]);

  const reloadGrievances = () => {
    const allUni = getGrievancesByUniversity(universityName);
    setAssignedComplaints(allUni);
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

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Resolved") {
      const resolvedItem = resolveGrievanceStatus(id, "Grievance investigated and resolved by Officer.");
      reloadGrievances();
      reloadNotifications();
      setAlertMsg(`Grievance ${id} marked as Resolved! Admin notified & User PDF report generated.`);
      if (resolvedItem) {
        downloadResolutionPDF(resolvedItem);
      }
    } else {
      setAssignedComplaints((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      setAlertMsg(`Status for Grievance ${id} updated to '${newStatus}'!`);
    }
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleStatClick = (status) => {
    setStatusFilter((prev) => (prev === status ? "All" : status));
    setActiveTab("assigned");
  };

  const firstName = userName ? userName.trim().split(" ")[0] : "Officer";
  const todayFormattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dept = user?.department || "Computer Science Department";
  const lastLogin = user?.lastLogin || new Date().toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const filteredList = assignedComplaints.filter((c) =>
    statusFilter === "All" ? true : c.status === statusFilter
  );

  const pendingCount = assignedComplaints.filter((c) => c.status === "Pending").length;
  const inProgressCount = assignedComplaints.filter((c) => c.status === "In Progress").length;
  const resolvedCount = assignedComplaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="officer-dashboard">
      <header className="officer-header-bar">
        <div className="header-left-section">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)} title="Open Sidebar Menu">
            ☰
          </button>
          <div className="header-brand">
            <h1>Welcome, {firstName}!</h1>
            <p>{todayFormattedDate} • {universityName} Officer Desk</p>
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
              <h3>Officer Portal</h3>
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
                  className={`sidebar-link ${activeTab === "assigned" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("assigned");
                    setIsSidebarOpen(false);
                  }}
                >
                  Assigned Complaints
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
        <div className="stats-grid">
          <div className={`stat-card ${statusFilter === "All" ? "active-filter" : ""}`} onClick={() => handleStatClick("All")}>
            <div className="stat-details">
              <h4>Total Desk Grievances</h4>
              <span>{assignedComplaints.length}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "Pending" ? "active-filter" : ""}`} onClick={() => handleStatClick("Pending")}>
            <div className="stat-details">
              <h4>Pending Review</h4>
              <span>{pendingCount}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "In Progress" ? "active-filter" : ""}`} onClick={() => handleStatClick("In Progress")}>
            <div className="stat-details">
              <h4>In Progress</h4>
              <span>{inProgressCount}</span>
            </div>
          </div>

          <div className={`stat-card ${statusFilter === "Resolved" ? "active-filter" : ""}`} onClick={() => handleStatClick("Resolved")}>
            <div className="stat-details">
              <h4>Resolved</h4>
              <span>{resolvedCount}</span>
            </div>
          </div>
        </div>

        {alertMsg && (
          <div className="alert-banner success" style={{ marginBottom: "20px", background: "#f0fdf4", color: "#166534", padding: "12px 18px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
            ✅ {alertMsg}
          </div>
        )}

        {activeTab === "assigned" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>{statusFilter === "All" ? `${universityName} Complaints Action` : `Filtered: ${statusFilter}`}</h3>
              {statusFilter !== "All" && (
                <button className="action-btn-edit" onClick={() => setStatusFilter("All")}>
                  Show All
                </button>
              )}
            </div>

            <div className="grievance-table-wrapper">
              <table className="grievance-table-custom">
                <thead>
                  <tr>
                    <th>Grievance ID</th>
                    <th>User & Role</th>
                    <th>Category & Subject</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action / Resolve</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    filteredList.map((g) => (
                      <tr key={g.id}>
                        <td><strong>{g.id}</strong></td>
                        <td>
                          <strong>{g.raisedBy || g.userName || "User"}</strong><br />
                          <small style={{ color: "#0284c7" }}>[{g.role || "User"}]</small>
                        </td>
                        <td>
                          <strong>{g.subject || g.title}</strong><br />
                          <small style={{ color: "#64748b" }}>{g.category}</small>
                        </td>
                        <td>
                          <small style={{ color: "#475569" }}>{g.description}</small>
                        </td>
                        <td>
                          <span className={`badge ${g.status.toLowerCase().replace(" ", "-")}`}>
                            {g.status}
                          </span>
                        </td>
                        <td>
                          {g.status === "Resolved" ? (
                            <button
                              className="action-btn-edit"
                              style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
                              onClick={() => downloadResolutionPDF(g)}
                            >
                              📄 Download PDF
                            </button>
                          ) : (
                            <select
                              value={g.status}
                              onChange={(e) => handleStatusChange(g.id, e.target.value)}
                              className="action-select-dark"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolve & Generate Report PDF</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No complaints assigned matching filter.
                      </td>
                    </tr>
                  )}
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
              <h3>Officer Photo</h3>
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
              <h3>Edit Officer Details</h3>
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
                  <label>Upload Officer Photo</label>
                  <DragDropUpload
                    onFileSelected={(file) => console.log("Officer photo selected:", file)}
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

export default OfficerDashboard;
