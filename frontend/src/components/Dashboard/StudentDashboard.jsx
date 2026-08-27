import React, { useState, useEffect } from "react";
import "../../styles/StudentDashboard.css";
import axios from "axios";
import { getApiUrl } from "../../utils/apiConfig";

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

const StudentDashboard = ({ user }) => {
  const universityName = user?.university || user?.college || "OUTR University";
  const userEmail = user?.email || "student@gmail.com";

  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getNotificationsForUser(userEmail, universityName));
  }, [userEmail, universityName]);

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsReadInStore(id);
    setNotifications(updated.filter(n => n.recipientKey === userEmail));
  };

  const handleClearAllNotifications = () => {
    const updated = clearNotificationsInStore(userEmail);
    setNotifications(updated.filter(n => n.recipientKey === userEmail));
  };

  // Profile & Avatar State
  const [userName, setUserName] = useState(user?.name || user?.email || "Student User");
  const [customPic, setCustomPic] = useState(null);
  const [userAvatar] = useState("🎓");

  // Profile Popups State
  const [showPicViewerModal, setShowPicViewerModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Change Password State
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordBanner, setPasswordBanner] = useState({ type: "", text: "" });

  // Grievances List State
  const [grievances, setGrievances] = useState([]);

  const reloadGrievances = () => {
    const allUni = getGrievancesByUniversity(universityName);
    // Student sees grievances raised by them or relevant to student
    setGrievances(allUni.filter(g => g.email === userEmail || g.role === "Student"));
  };

  useEffect(() => {
    reloadGrievances();
  }, [universityName, userEmail]);

  // Modal State for New / Edit Grievance
  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formGrievance, setFormGrievance] = useState({
    title: "",
    category: "Academic",
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
      category: "Academic",
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
    if (formGrievance.category === "Other" && !formGrievance.otherCategory) {
      setModalAlert("Please specify the category under Other.");
      return;
    }
    if (formGrievance.category === "Hostel" && !formGrievance.hostelName) {
      setModalAlert("Please enter your Hostel Name.");
      return;
    }

    if (editingId) {
      setGrievances((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...formGrievance } : item
        )
      );
      setModalAlert("Grievance updated successfully!");
    } else {
      const createdData = {
        id: `GRM-${Math.floor(1000 + Math.random() * 9000)}`,
        role: "Student",
        raisedBy: userName,
        email: userEmail,
        university: universityName,
        department: user?.department || "Computer Science",
        ...formGrievance,
      };

      saveNewGrievance(createdData);
      reloadGrievances();
      setModalAlert("Grievance submitted successfully to Admin!");
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
      await axios.post(getApiUrl("/api/forgot-password"), {
        email: userEmail,
        newPassword: passwordData.newPassword,
        role: "Student",
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

  const totalGrievances = grievances.length;
  const pendingCount = grievances.filter((g) => g.status === "Pending").length;
  const inProgressCount = grievances.filter((g) => g.status === "In Progress").length;
  const resolvedCount = grievances.filter((g) => g.status === "Resolved").length;

  const filteredGrievances = grievances.filter((g) =>
    statusFilter === "All" ? true : g.status === statusFilter
  );

  const firstName = userName ? userName.trim().split(" ")[0] : "Student";
  const todayFormattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const regNo = user?.registrationNumber || "23110662";
  const course = user?.course || "B.Tech";
  const department = user?.department || "Computer Science";
  const joiningYear = user?.joiningYear || "2023";
  const lastLogin = user?.lastLogin || new Date().toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="unified-dashboard">
      {/* Header Bar with Welcome & Notification Bell */}
      <header className="dashboard-header-bar">
        <div className="header-left-section">
          <button
            className="hamburger-btn"
            title="Open Sidebar Menu"
            onClick={() => setIsSidebarOpen(true)}
          >
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
              <h3>Student Menu</h3>
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

      {/* Main Dashboard Container */}
      <div className="dashboard-main-container">
        {/* + New Grievance Button */}
        <div className="main-top-action-bar">
          <button className="new-grievance-main-btn" onClick={openNewGrievanceModal}>
            + New Grievance
          </button>
        </div>

        {/* Clean Icon-Free Stat Cards */}
        <div className="stats-grid">
          <div
            className={`stat-card ${statusFilter === "All" ? "active-filter" : ""}`}
            onClick={() => handleStatClick("All")}
          >
            <div className="stat-details">
              <h4>Total Submitted</h4>
              <span>{totalGrievances}</span>
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === "Pending" ? "active-filter" : ""}`}
            onClick={() => handleStatClick("Pending")}
          >
            <div className="stat-details">
              <h4>Pending Review</h4>
              <span>{pendingCount}</span>
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === "In Progress" ? "active-filter" : ""}`}
            onClick={() => handleStatClick("In Progress")}
          >
            <div className="stat-details">
              <h4>In Progress</h4>
              <span>{inProgressCount}</span>
            </div>
          </div>

          <div
            className={`stat-card ${statusFilter === "Resolved" ? "active-filter" : ""}`}
            onClick={() => handleStatClick("Resolved")}
          >
            <div className="stat-details">
              <h4>Resolved</h4>
              <span>{resolvedCount}</span>
            </div>
          </div>
        </div>

        {/* View 1: Dashboard Table */}
        {activeView === "dashboard" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>
                {statusFilter === "All" ? "Dashboard Grievances" : `Filtered Grievances: ${statusFilter}`}
              </h3>
              {statusFilter !== "All" && (
                <button className="action-btn-edit" onClick={() => setStatusFilter("All")}>
                  Show All ({totalGrievances})
                </button>
              )}
            </div>

            <div className="grievance-table-wrapper">
              <table className="grievance-table-custom">
                <thead>
                  <tr>
                    <th>Grievance ID</th>
                    <th>Title & Related Category</th>
                    <th>Details & Attachment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action / Report</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrievances.length > 0 ? (
                    filteredGrievances.map((g) => (
                      <tr key={g.id}>
                        <td><strong>{g.id}</strong></td>
                        <td>
                          <strong>{g.title || g.subject}</strong>
                          <br />
                          <small style={{ color: "#0284c7", fontWeight: "600" }}>
                            Category: {g.category === "Other" ? `Other (${g.otherCategory})` : g.category}
                            {g.category === "Hostel" && g.hostelName && ` • ${g.hostelName}`}
                          </small>
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
                            <button
                              className="action-btn-edit"
                              onClick={() => openEditGrievanceModal(g)}
                            >
                              Edit
                            </button>
                          ) : g.status === "Resolved" ? (
                            <button
                              className="action-btn-edit"
                              style={{ background: "#f0fdf4", color: "#166534", borderColor: "#bbf7d0" }}
                              onClick={() => downloadResolutionPDF(g)}
                              title="Download Resolution Report PDF"
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
                        No grievances found under '{statusFilter}' status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 2: Full Profile Details */}
        {activeView === "profile" && (
          <div className="card-panel">
            <div className="panel-header">
              <h3>User Profile Information</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Full Name</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{userName}</p>
              </div>
              <div className="stat-card">
                <h4>Institution / University</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{universityName}</p>
              </div>
              <div className="stat-card">
                <h4>Registration Number</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{regNo}</p>
              </div>
              <div className="stat-card">
                <h4>Course & Department</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{course} - {department}</p>
              </div>
              <div className="stat-card">
                <h4>Email Address</h4>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{userEmail}</p>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Change Password */}
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

      {/* Profile Picture Enlarged Viewer Modal */}
      {showPicViewerModal && (
        <div className="modal-overlay" onClick={() => setShowPicViewerModal(false)}>
          <div className="modal-dialog" style={{ width: "360px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>Profile Picture</h3>
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

      {/* Edit Profile Modal */}
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
                    onFileSelected={(file) => console.log("Profile picture file selected:", file)}
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

      {/* Grievance Submit Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancelClick}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog-header">
              <h3>{editingId ? `Edit Grievance (${editingId})` : "Submit New Grievance"}</h3>
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

                {/* Category Selection with Popup Modal */}
                <CategoryPopupSelect
                  selectedCategory={formGrievance.category}
                  onSelectCategory={(cat) => setFormGrievance({ ...formGrievance, category: cat })}
                />

                {formGrievance.category === "Other" && (
                  <div className="form-group-custom">
                    <label>Specify Custom Category *</label>
                    <input
                      type="text"
                      placeholder="Type custom category name..."
                      value={formGrievance.otherCategory}
                      onChange={(e) => setFormGrievance({ ...formGrievance, otherCategory: e.target.value })}
                      required
                    />
                  </div>
                )}

                {formGrievance.category === "Hostel" && (
                  <div className="form-group-custom">
                    <label>Hostel Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Hostel Name (e.g. Block A, APJ Kalam Hall)..."
                      value={formGrievance.hostelName}
                      onChange={(e) => setFormGrievance({ ...formGrievance, hostelName: e.target.value })}
                      required
                    />
                  </div>
                )}

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

                {/* Drag and Drop File Upload */}
                <div className="form-group-custom">
                  <label>Supporting Document / Proof (Optional)</label>
                  <DragDropUpload
                    onFileSelected={handleFileDrop}
                    selectedFileName={formGrievance.docName}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </div>

                {/* Submit & Cancel Buttons */}
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

      {/* Cancel Submission Confirmation Dialog Modal */}
      <CancelConfirmModal
        isOpen={showCancelConfirm}
        onConfirmCancel={handleConfirmCancelForm}
        onDismiss={() => setShowCancelConfirm(false)}
      />
    </div>
  );
};

export default StudentDashboard;
