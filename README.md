# 🎓 Grievance Redressal Management System (GRMS)

A full-stack web application built to streamline, manage, and resolve grievances across university campuses. It provides transparent communication between students, faculty members, non-teaching staff, grievance officers, and administrators.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Distinct workflows and customized dashboards for:
  - **Students**: File grievances, track status updates in real-time, attach files/proofs, and download official PDF resolution certificates.
  - **Teaching Staff**: Submit academic or workplace concerns and monitor departmental actions.
  - **Non-Teaching Staff**: Dedicated portal for logistical, administrative, and workplace requests.
  - **Grievance Officers**: Review, filter, update complaint statuses (`Pending` ➔ `In Progress` ➔ `Resolved` / `Rejected`), add remarks, and generate resolution reports.
  - **Administrators**: University-wide oversight with analytics, category distribution charts, and user management.

- **Instant PDF Resolution Reports**: Automatically generates and downloads clean, formatted PDF reports for resolved grievances using `jsPDF`.
- **Real-Time In-App Notifications**: Alerts users whenever an officer updates their grievance status or adds comments.
- **Fault-Tolerant Architecture**: Works with MongoDB Atlas on the cloud, with built-in fallback handling for offline development.
- **Modern & Responsive UI**: Clean glassmorphic design, smooth modals, custom dropdowns, and responsive layout across desktop and mobile screens.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite**
- **React Router 7**
- **Vanilla CSS** & **Tailwind CSS**
- **Axios** (API integration)
- **jsPDF** (PDF Report Generation)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)** & **bcryptjs** (Authentication & password security)
- **Cors** & **Dotenv**

---

## 📁 Project Structure

```text
GRMS-project/
├── backend/
│   ├── Registration_Database/     # DB connection utilities
│   ├── RoleBasedSchemaModels/     # MongoDB Mongoose models (Student, Admin, Officer, etc.)
│   ├── Routes/                    # Auth, registration, and grievance APIs
│   ├── .env.example               # Environment variables template
│   ├── server.js                  # Main Express server entrypoint
│   └── package.json
├── frontend/
│   ├── public/                    # Static assets & SPA redirect configs
│   ├── src/
│   │   ├── components/            # Dashboard, Login, Register & Shared UI components
│   │   ├── styles/                # Component & page stylesheets
│   │   ├── utils/                 # API config, PDF generator, and store helpers
│   │   ├── App.jsx                # Main route handler
│   │   └── main.jsx
│   └── package.json
├── DEPLOYMENT.md                  # Detailed Render deployment instructions
├── render.yaml                    # Render 1-click blueprint configuration
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) database cluster or local MongoDB instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/Mr-Navy013/GRMS-Project.git
cd GRMS-Project
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
MONGODB_URL=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key_here
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Pre-seeded Demo Accounts

When the backend starts up, default accounts are automatically created for quick testing:

| Role | Email / Username | Password |
| :--- | :--- | :--- |
| **Student** | `student@gmail.com` | `Student@123` |
| **Teaching Staff** | `teachingstaff@gmail.com` | `Teacher@123` |
| **Non-Teaching Staff** | `nonteachingstaff@gmail.com` | `NonTeachingStaff@123` |
| **Grievance Officer** | `officer@gmail.com` | `Officer@123` |
| **Admin** | `admin@gmail.com` (or `OUTR1981`) | `Admin@123` |

---

## ☁️ Deployment

This project is pre-configured for zero-friction deployment on **Render**:
- **Automated Blueprint**: Uses `render.yaml` to deploy both backend and frontend together.
- **Static Site Routing**: Includes `_redirects` for smooth SPA page refreshes.

Check out the full step-by-step instructions in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
