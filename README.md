
# ❖ TaskMaster (CollaborativeTaskManager)

A modern, role-based collaborative task management platform designed to simplify teamwork. Managers can easily assign tasks, set priorities, and monitor deadlines, while team members can view their personalized workspaces and track their progress in real-time.

## ✨ Key Features

* **Role-Based Access Control (RBAC):** Distinct, secure portals for Managers and standard Users.
* **Streamlined Task Management:** Create, assign, prioritize, and track tasks seamlessly across "Pending" and "Completed" states.
* **Secure Authentication:** Custom JWT (JSON Web Token) and Bcrypt authentication connected directly to MongoDB.
* **Modern UI/UX:** Built with Tailwind CSS and Framer Motion for a fluid, animated, and highly responsive design.
* **Dark/Light Mode:** Seamless global theme toggling with persistent state.

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js (App Router, Turbopack)
* **Styling & Animation:** Tailwind CSS, Framer Motion
* **State Management:** Zustand
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/)
* [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (or a MongoDB Atlas account)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/taskmanager.git](https://github.com/yourusername/taskmanager.git)


Developer Remarks on app guideline 

 Here is a step-by-step guide on how to get around:

### 1. The Starting Point (Landing Page)
When you first open the application, you will arrive at our welcome screen. From here, click the **Get Started** button in the top right corner to begin. 

### 2. Choosing Your Path (Log In)
TaskMaster is split into two distinct workspaces to keep things organized and secure:
* **For Managers:** Use the Manager Portal to log in or create an account. This grants you the ability to oversee the team and delegate work.
* **For Team Members:** Use the standard User Portal to log in. Your view is focused entirely on your personal assignments.

### 3. The Manager Workspace (`/dashboard`)
If you log in as a Manager, you will be taken to your command center. 
* **Assigning Work:** Click the prominent **+ Assign New Task** button to open a simple form. Here, you can title a task, set a deadline, choose a priority level, and select a team member from the dropdown menu to assign the work.
* **Tracking Progress:** Use the **Pending** and **Completed** tabs to seamlessly flip between what your team is currently working on and what has already crossed the finish line.

### 4. The Team Member Workspace (`/userdashboard`)
If you log in as a standard User, your dashboard acts as your personal to-do list. 
* **Your Daily Focus:** The top of your screen provides a quick, visual count of your pending versus completed tasks for the day.
* **Taking Action:** Under the **Action Required** section, you will see the specific tasks your manager has assigned to you. Once you finish a task, simply click **Mark Complete ✓**, and it will automatically move down to your completed history.
