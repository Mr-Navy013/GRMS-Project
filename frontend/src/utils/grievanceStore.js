// Centralized Grievance Data & Notification Store with University Scoping

const STORAGE_KEY_GRIEVANCES = "grms_all_grievances_v2";
const STORAGE_KEY_NOTIFICATIONS = "grms_all_notifications_v2";

const DEFAULT_UNIVERSITY = "OUTR University";

const initialGrievances = [
  {
    id: "GRM-1001",
    role: "Student",
    raisedBy: "Student 1",
    email: "student@gmail.com",
    university: "OUTR University",
    universityId: "OUTR1981",
    title: "Issue with Mid-Semester Exam Marks Upload",
    category: "Academic",
    hostelName: "",
    otherCategory: "",
    department: "Computer Science",
    urgency: "High",
    status: "In Progress",
    assignedOfficer: "Officer 1",
    description: "My mid-sem marks for Data Structures are missing in the portal.",
    docName: "exam_hall_ticket.pdf",
    date: "2026-08-10",
  },
  {
    id: "GRM-1002",
    role: "Student",
    raisedBy: "Student 2",
    email: "student2@gmail.com",
    university: "OUTR University",
    universityId: "OUTR1981",
    title: "Wi-Fi Router Signal Weak in Hostel Block B",
    category: "Hostel",
    hostelName: "Block B Hostel",
    otherCategory: "",
    department: "IT / Infrastructure",
    urgency: "Medium",
    status: "Pending",
    assignedOfficer: "",
    description: "Frequent disconnections during evening hours in Hostel Block B room 204.",
    docName: "wifi_speed_screenshot.png",
    date: "2026-08-12",
  },
  {
    id: "TS-201",
    role: "Teaching Staff",
    raisedBy: "Teacher 1",
    email: "teachingstaff@gmail.com",
    university: "OUTR University",
    universityId: "OUTR1981",
    title: "Smart Board Calibration in Room 304",
    category: "Infrastructure",
    hostelName: "",
    otherCategory: "",
    department: "Computer Science",
    urgency: "High",
    status: "In Progress",
    assignedOfficer: "Officer 1",
    description: "Touch response on interactive whiteboard is offset by 2 inches.",
    docName: "smartboard_error_log.pdf",
    date: "2026-08-11",
  },
  {
    id: "NTS-301",
    role: "Non-Teaching Staff",
    raisedBy: "Non-Teaching Staff 1",
    email: "nonteachingstaff@gmail.com",
    university: "OUTR University",
    universityId: "OUTR1981",
    title: "Water Cooler Leakage in Admin Block",
    category: "Infrastructure",
    hostelName: "",
    otherCategory: "",
    department: "Administration",
    urgency: "High",
    status: "In Progress",
    assignedOfficer: "Officer 1",
    description: "Water leaking near administrative office entrance.",
    docName: "",
    date: "2026-08-12",
  },
];

const initialNotifications = [
  {
    id: 101,
    recipientKey: "student@gmail.com",
    university: "OUTR University",
    title: "Grievance Update (GRM-1001)",
    msg: "Status updated to In Progress by Officer 1.",
    time: "10 mins ago",
    isRead: false,
  },
  {
    id: 102,
    recipientKey: "student@gmail.com",
    university: "OUTR University",
    title: "System Alert",
    msg: "Welcome to OUTR Grievance Redressal Portal.",
    time: "1 hour ago",
    isRead: true,
  },
  {
    id: 201,
    recipientKey: "teachingstaff@gmail.com",
    university: "OUTR University",
    title: "Request Update (TS-201)",
    msg: "Smart board request assigned to Officer 1.",
    time: "15 mins ago",
    isRead: false,
  },
  {
    id: 202,
    recipientKey: "teachingstaff@gmail.com",
    university: "OUTR University",
    title: "System Alert",
    msg: "Welcome to OUTR Teaching Staff Portal.",
    time: "2 hours ago",
    isRead: true,
  },
  {
    id: 301,
    recipientKey: "nonteachingstaff@gmail.com",
    university: "OUTR University",
    title: "Work Order Update (NTS-301)",
    msg: "Facility complaint logged with Admin Office.",
    time: "30 mins ago",
    isRead: false,
  },
  {
    id: 302,
    recipientKey: "nonteachingstaff@gmail.com",
    university: "OUTR University",
    title: "System Alert",
    msg: "Welcome to Non-Teaching Staff Workspace.",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: 401,
    recipientKey: "admin@gmail.com",
    university: "OUTR University",
    title: "System Health Alert",
    msg: "All university grievance queues running optimally.",
    time: "10 mins ago",
    isRead: false,
  },
  {
    id: 402,
    recipientKey: "admin@gmail.com",
    university: "OUTR University",
    title: "New Grievance Submitted",
    msg: "New Student grievance GRM-1002 registered for OUTR University.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 501,
    recipientKey: "officer@gmail.com",
    university: "OUTR University",
    title: "New Grievance Assigned",
    msg: "GRM-1001 assigned to your department desk.",
    time: "5 mins ago",
    isRead: false,
  },
];

// Helper to load state
export const loadGrievances = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_GRIEVANCES);
    return data ? JSON.parse(data) : initialGrievances;
  } catch (e) {
    return initialGrievances;
  }
};

export const saveGrievances = (grievances) => {
  try {
    localStorage.setItem(STORAGE_KEY_GRIEVANCES, JSON.stringify(grievances));
  } catch (e) {
    console.error("Failed to save grievances:", e);
  }
};

export const loadNotifications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    return data ? JSON.parse(data) : initialNotifications;
  } catch (e) {
    return initialNotifications;
  }
};

export const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error("Failed to save notifications:", e);
  }
};

/**
 * Filter grievances strictly by University/College name.
 */
export const getGrievancesByUniversity = (universityName = DEFAULT_UNIVERSITY) => {
  const all = loadGrievances();
  return all.filter((g) => (g.university || DEFAULT_UNIVERSITY).toLowerCase() === universityName.toLowerCase());
};

/**
 * Add a new grievance from a user.
 */
export const saveNewGrievance = (grievanceData) => {
  const all = loadGrievances();
  const university = grievanceData.university || DEFAULT_UNIVERSITY;

  const newGrievance = {
    ...grievanceData,
    university,
    status: "Pending",
    assignedOfficer: "",
    date: new Date().toISOString().split("T")[0],
  };

  const updatedAll = [newGrievance, ...all];
  saveGrievances(updatedAll);

  // Notify Admin of same university
  addNotification({
    recipientKey: "admin@gmail.com",
    university,
    title: "New Grievance Submitted",
    msg: `New grievance (${newGrievance.id}) submitted by ${newGrievance.raisedBy || "User"}.`,
    time: "Just now",
  });

  return newGrievance;
};

/**
 * Assign Officer to Grievance (Admin Action).
 */
export const assignOfficerToGrievance = (grievanceId, officerName, officerEmail = "officer@gmail.com") => {
  const all = loadGrievances();
  let updatedItem = null;

  const updatedAll = all.map((g) => {
    if (g.id === grievanceId) {
      updatedItem = { ...g, assignedOfficer: officerName, status: "In Progress" };
      return updatedItem;
    }
    return g;
  });

  saveGrievances(updatedAll);

  if (updatedItem) {
    // Notify assigned officer
    addNotification({
      recipientKey: officerEmail,
      university: updatedItem.university,
      title: "Grievance Assigned",
      msg: `Grievance ${grievanceId} assigned to you.`,
      time: "Just now",
    });

    // Notify user
    addNotification({
      recipientKey: updatedItem.email,
      university: updatedItem.university,
      title: `Grievance Updated (${grievanceId})`,
      msg: `Assigned to ${officerName}. Status changed to In Progress.`,
      time: "Just now",
    });
  }

  return updatedAll;
};

/**
 * Resolve Grievance (Officer Action).
 */
export const resolveGrievanceStatus = (grievanceId, resolutionNotes = "Resolved by assigned officer.") => {
  const all = loadGrievances();
  let updatedItem = null;

  const updatedAll = all.map((g) => {
    if (g.id === grievanceId) {
      updatedItem = { ...g, status: "Resolved", resolutionNotes };
      return updatedItem;
    }
    return g;
  });

  saveGrievances(updatedAll);

  if (updatedItem) {
    // Notify Admin of problem resolution
    addNotification({
      recipientKey: "admin@gmail.com",
      university: updatedItem.university,
      title: "Grievance Solved Alert",
      msg: `Problem solved for ${grievanceId} by ${updatedItem.assignedOfficer || "Officer"}. PDF report generated.`,
      time: "Just now",
    });

    // Notify User with PDF Report available message
    addNotification({
      recipientKey: updatedItem.email,
      university: updatedItem.university,
      title: `Grievance Solved (${grievanceId})`,
      msg: `Your grievance has been resolved! Formal PDF report has been generated & dispatched to your email.`,
      time: "Just now",
    });
  }

  return updatedItem;
};

/**
 * Notification Helpers
 */
export const addNotification = ({ recipientKey, university = DEFAULT_UNIVERSITY, title, msg, time = "Just now" }) => {
  const all = loadNotifications();
  const newItem = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    recipientKey,
    university,
    title,
    msg,
    time,
    isRead: false,
  };
  saveNotifications([newItem, ...all]);
};

export const getNotificationsForUser = (userEmail, universityName = DEFAULT_UNIVERSITY) => {
  const all = loadNotifications();
  return all.filter(
    (n) =>
      (n.recipientKey === userEmail || n.recipientKey === "admin@gmail.com" && userEmail.includes("admin")) &&
      (n.university || DEFAULT_UNIVERSITY).toLowerCase() === universityName.toLowerCase()
  );
};

export const markNotificationAsReadInStore = (notifId) => {
  const all = loadNotifications();
  const updated = all.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
  saveNotifications(updated);
  return updated;
};

export const clearNotificationsInStore = (userEmail) => {
  const all = loadNotifications();
  const updated = all.filter((n) => n.recipientKey !== userEmail);
  saveNotifications(updated);
  return updated;
};
