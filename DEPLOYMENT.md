# GRMS Deployment Guide on Render (Full Stack + Database)

This project consists of:
1. **Database**: MongoDB Atlas Cloud (Live & Fully Cloud-Hosted)
2. **Backend**: Node.js / Express API
3. **Frontend**: React + Vite SPA

---

## ⚡ Option 1: 1-Click Blueprint Deploy (Recommended & Fastest)

Render supports **Blueprints** using the included `render.yaml` file to deploy Frontend & Backend together automatically.

1. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints).
2. Click **New Blueprint Instance**.
3. Connect your GitHub repository: `Mr-Navy013/GRMS-Project`.
4. Click **Apply**.
5. Render will automatically detect `render.yaml`, build the backend web service and the frontend static site, and link them together!

---

## 🛠️ Option 2: Manual Deployment via Render Dashboard

If you prefer to create the services individually in Render:

### Step 1: Deploy Backend (Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) -> Click **New +** -> **Web Service**.
2. Connect your repo `Mr-Navy013/GRMS-Project`.
3. Configure the settings:
   - **Name**: `grms-backend`
   - **Root Directory**: `backend`
   - **Environment / Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
4. Add **Environment Variables**:
   - `MONGODB_URL`: `mongodb+srv://navycutdehury:Navy%401234@grievance.qiez47o.mongodb.net/grievance?retryWrites=true&w=majority`
   - `PORT`: `10000`
   - `JWT_SECRET`: `grievance_secret_key_2026`
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.
6. Note down your backend URL (e.g. `https://grms-backend.onrender.com`).

---

### Step 2: Deploy Frontend (Static Site)
1. Go to [Render Dashboard](https://dashboard.render.com/) -> Click **New +** -> **Static Site**.
2. Connect your repo `Mr-Navy013/GRMS-Project`.
3. Configure the settings:
   - **Name**: `grms-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com` (use your backend URL from Step 1)
5. Under **Redirects/Rewrites**:
   - Add rewrite: Source `/*` -> Destination `/index.html` (Status: `200 Rewrite`)
   *(Note: The `_redirects` file included in `frontend/public/` handles this automatically as well).*
6. Click **Create Static Site**.

---

## 🗄️ Database Info (MongoDB Atlas)
- **Status**: Live on MongoDB Atlas Cloud 24/7.
- **Auto-seeding**: When the backend starts up, default accounts for all roles (Student, Teaching Staff, Non-Teaching Staff, Officer, Admin) are automatically seeded if not already present.

### Default Login Credentials
- **Student**: `student@gmail.com` / `Student@123`
- **Teaching Staff**: `teachingstaff@gmail.com` / `Teacher@123`
- **Non-Teaching Staff**: `nonteachingstaff@gmail.com` / `NonTeachingStaff@123`
- **Officer**: `officer@gmail.com` / `Officer@123`
- **Admin**: `admin@gmail.com` (or `OUTR1981`) / `Admin@123`
