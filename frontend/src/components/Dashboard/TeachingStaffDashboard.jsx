import React, { useState, useEffect } from "react";
import "../../styles/TeachingStaffDashboard.css";
import axios from "axios";

import NotificationBell from "../Shared/NotificationBell";
import CategoryPopupSelect from "../Shared/CategoryPopupSelect";
import DragDropUpload from "../Shared/DragDropUpload";
import CancelConfirmModal from "../Shared/CancelConfirmModal";

import {
  getGrievancesByUniversity,
  saveNewGrievance,
  getNotificationsForUser,
  markNotificationAsReadInStore,
  clearNotificationsInStore,
} from "../../utils/grievanceStore";

import { downloadResolutionPDF } from "../../utils/pdfReportUtil";

const TeachingStaffDashboard = ({ user }) => {
  const universityName = user?.university || user?.college || "OUTR University";
  const userEmail = user?.email || "teachingstaff@gmail.com";

  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getNotificationsForUser(userEmail, universityName));
  }, [userEmail, universityName]);

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsReadInStore(id);
    setNotifications(updated.filter((n) => n.recipientKey === userEmail));
  };

  const handleClearAllNotifications = () => {
    const updated = clearNotificationsInStore(userEmail);
    setNotifications(updated.filter((n) => n.recipientKey === userEmail));
  };

  const [userName, setUserName] = useState(user?.name || user?.email || "Faculty Member");
  const [customPic, setCustomPic] = useState(null);
  const [userAvatar] = useState("👨‍🏫");

  const [showPicViewerModal, setShowPicViewerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordBanner, setPasswordBanner] = useState({ type: "", text: "" });

  const [requests, setRequests] = useState([]);

  const reloadGrievances = () => {
    const allUni = getGrievancesByUniversity(universityName);
    setRequests(allUni.filter((g) => g.email === userEmail || g.role === "Teaching Staff"));
  };

  useEffect(() => {
    reloadGrievances();
  }, [universityName, userEmail]);

  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formGrievance, setFormGrievance] = useState({
    title: "",
    category: "Faculty",
    otherCategory: "",
    hostelName: "",
    description: "",
    docName: "",
  });
  const [modalAlert, setModalAlert] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("grms_role");
    localStorage.removeItem("grms_user");
    window.location.reload();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setCustomPic(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileModal = (e) => {
    e.preventDefault();
    setUserName(tempName);
    setShowEditProfileModal(false);
  };

  const handleFileDrop = (file) => {
    if (file) {
      setFormGrievance((prev) => ({ ...prev, docName: file.name }));
    } else {
      setFormGrievance((prev) => ({ ...prev, docName: "" }));
    }
  };

  const openNewGrievanceModal = () => {
    setEditingId(null);
    setFormGrievance({
      title: "",
      category: "Faculty",
      otherCategory: "",
      hostelName: "",
      description: "",
      docName: "",
    });
    setModalAlert("");
    setShowModal(true);
  };

  const openEditGrievanceModal = (g) => {
    if (g.status !== "Pending") return;
    setEditingId(g.id);
    setFormGrievance({
      title: g.title,
      category: g.category,
      otherCategory: g.otherCategory || "",
      hostelName: g.hostelName || "",
      description: g.description,
      docName: g.docName || "",
    });
    setModalAlert("");
    setShowModal(true);
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancelForm = () => {
    setShowCancelConfirm(false);
    setShowModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formGrievance.title || !formGrievance.description) {
      setModalAlert("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      setRequests((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...formGrievance } : item))
      );
      setModalAlert("Request updated successfully!");
    } else {
      const createdData = {
        id: `TS-${Math.floor(200 + Math.random() * 800)}`,
        role: "Teaching Staff",
        raisedBy: userName,
        email: userEmail,
        university: universityName,
        department: user?.department || "Computer Science",
        ...formGrievance,
      };

      saveNewGrievance(createdData);
      reloadGrievances();
      setModalAlert("Faculty request submitted successfully to Admin!");
    }

    setTimeout(() => {
      setShowModal(false);
      setModalAlert("");
      setActiveView("dashboard");
    }, 1000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordBanner({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordBanner({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/forgot-password", {
        email: userEmail,
        newPassword: passwordData.newPassword,
        role: "Teaching Staff",
      });

      setPasswordBanner({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordBanner({ type: "error", text: err.response?.data?.error || "Failed to update password." });
    }
  };

  const handleStatClick = (status) => {
    setStatusFilter((prev) => (prev === status ? "All" : status));
    setActiveView("dashboard");
  };

  const totalRequests = requests.length;
  const pendingCount = requests.filter((g) => g.status === "Pending").length;
  const inProgressCount = requests.filter((g) => g.status === "In Progress").length;
  const resolvedCount = requests.filter((g) => g.status === "Resolved").length;

  const filteredRequests = requests.filter((g) =>
    statusFilter === "All" ? true : g.status === statusFilter
  );

  const firstName = userName ? userName.trim().split(" ")[0] : "Faculty";
  const todayFormattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const department = user?.department || "Computer Science";
  const joiningYear = user?.joiningYear || "2013";
  const lastLogin = user?.lastLogin || new Date().toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="unified-dashboard">
      <header className="dashboard-header-bar">
        <div className="header-left-section">
          <button className="hamburger-btn" title="Open Sidebar Menu" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <div className="header-brand">
            <h1>Welcome, {firstName}!</h1>
            <p>{todayFormattedDate} • {universityName}</p>
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
              <h3>Faculty Menu</h3>
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
                  className={`sidebar-link ${activeView === "dashboard" ? "active" : ""}`}
                  onClick={() => {
                    setActiveView("dashboard");
                    setIsSidebarOpen(false);
                  }}
                >
                  Dashboard
                </button>
                <button
                  className={`sidebar-link ${activeView === "profile" ? "active" : ""}`}
                  onClick={() => {
                    setActiveView("profile");
                    setIsSidebarOpen(false);
                  }}
                >
                  Profile Details
                </button>
                <button
                  className={`sidebar-link ${activeView === "change-password" ? "active" : ""}`}
                  onClick={() => {
                    setActiveView("change-password");
                    setIsSidebarOpen(false);
                  }}
                >
                  Change Password
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
        <div className="main-top-action-bar">
          <button className="new-grievance-main-btn" onClick={openNewGrievanceModal}>
            + Submit Faculty Grievance
          </button>
        </div>

        <div className="stats-grid">
          <div className={`stat-card ${statusFilter === "All" ? "active-filter" : ""}`} onClick={() => handleStatClick("All")}>
            <div className="stat-details">
              <h4>Total Submitted</h4>
              <span>{totalRequests}</span>
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

        {activeView === "dashboard" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>{statusFilter === "All" ? "Faculty Requests & Grievances" : `Filtered: ${statusFilter}`}</h3>
              {statusFilter !== "All" && (
                <button className="action-btn-edit" onClick={() => setStatusFilter("All")}>
                  Show All ({totalRequests})
                </button>
              )}
            </div>

            <div className="grievance-table-wrapper">
              <table className="grievance-table-custom">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Title & Category</th>
                    <th>Details & Attachment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action / Report</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((g) => (
                      <tr key={g.id}>
                        <td><strong>{g.id}</strong></td>
                        <td>
                          <strong>{g.title || g.subject}</strong><br />
                          <small style={{ color: "#0284c7", fontWeight: "600" }}>Category: {g.category}</small>
                        </td>
                        <td>
                          <small style={{ color: "#475569" }}>{g.description}</small>
                          {g.docName && (
                            <div style={{ marginTop: "4px" }}>
                              <small style={{ color: "#15803d", fontWeight: "bold" }}>📎 {g.docName}</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${g.status === "In Progress" ? "assigned" : g.status.toLowerCase().replace(" ", "-")}`}>
                            {g.status === "In Progress" ? "Assigned" : g.status}
                          </span>
                        </td>
                        <td>{g.date}</td>
                        <td>
                          {g.status === "Pending" ? (
                            <button className="action-btn-edit" onClick={() => openEditGrievanceModal(g)}>
                              Edit
                            </button>
                          ) : g.status === "Resolved" ? (
                            <button
                              className="action-btn-edit"
                              style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
                              onClick={() => downloadResolutionPDF(g)}
                            >
                              📄 Download PDF
                            </button>
                          ) : (
                            <span className="badge locked">In Progress</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                        No requests found under '{statusFilter}' status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === "profile" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>Faculty Profile Information</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Full Name</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{userName}</p>
              </div>
              <div className="stat-card">
                <h4>University / College</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{universityName}</p>
              </div>
              <div className="stat-card">
                <h4>Department</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{department}</p>
              </div>
              <div className="stat-card">
                <h4>Joining Year</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{joiningYear}</p>
              </div>
              <div className="stat-card">
                <h4>Email Address</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{userEmail}</p>
              </div>
            </div>
          </div>
        )}

        {activeView === "change-password" && (
          <div className="card-panel" style={{ maxWidth: "500px" }}>
            <div className="panel-header">
              <h3>Change Account Password</h3>
            </div>

            {passwordBanner.text && (
              <div className={`alert-banner ${passwordBanner.type}`} style={{ marginBottom: "20px" }}>
                {passwordBanner.text}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group-custom">
                <label>New Password *</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="modal-submit-btn">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      {showPicViewerModal && (
        <div className="modal-overlay" onClick={() => setShowPicViewerModal(false)}>
          <div className="modal-dialog" style={{ width: "360px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>Faculty Photo</h3>
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
              <h3>Edit Profile Details</h3>
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
                  <label>Upload New Profile Picture</label>
                  <DragDropUpload
                    onFileSelected={(file) => console.log("Faculty photo uploaded:", file)}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCancelClick}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>{editingId ? `Edit Request (${editingId})` : "Submit Faculty Grievance"}</h3>
              <button className="modal-dialog-close" onClick={handleCancelClick}>✖</button>
            </div>

            <div className="modal-dialog-body">
              {modalAlert && (
                <div className={`alert-banner ${modalAlert.includes("Please") ? "error" : "success"}`} style={{ marginBottom: "16px" }}>
                  {modalAlert}
                </div>
              )}

              <form onSubmit={handleFormSubmit}>
                <div className="form-group-custom">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={formGrievance.title}
                    onChange={(e) => setFormGrievance({ ...formGrievance, title: e.target.value })}
                    required
                  />
                </div>

                <CategoryPopupSelect
                  selectedCategory={formGrievance.category}
                  onSelectCategory={(cat) => setFormGrievance({ ...formGrievance, category: cat })}
                />

                <div className="form-group-custom">
                  <label>Description *</label>
                  <textarea
                    rows="4"
                    placeholder="mention briefly the situation"
                    value={formGrievance.description}
                    onChange={(e) => setFormGrievance({ ...formGrievance, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-custom">
                  <label>Supporting Document / Proof (Optional)</label>
                  <DragDropUpload
                    onFileSelected={handleFileDrop}
                    selectedFileName={formGrievance.docName}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="modal-cancel-btn" onClick={handleCancelClick}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-submit-btn">
                    {editingId ? "Save Changes" : "Submit Grievance"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <CancelConfirmModal
        isOpen={showCancelConfirm}
        onConfirmCancel={handleConfirmCancelForm}
        onDismiss={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};

export default TeachingStaffDashboard;
