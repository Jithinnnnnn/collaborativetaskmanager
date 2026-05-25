# ❖ TaskMaster - Collaborative Task Management Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

A modern, full-stack task management application with role-based access control, real-time updates, and a beautiful dark/light theme system.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-documentation) • [Project Structure](#-project-structure)

</div>

---

## 🎯 Overview

TaskMaster is a production-ready collaborative task management platform designed for modern teams. It provides distinct workspaces for managers and team members, enabling efficient task delegation, tracking, and completion with real-time synchronization.

### Key Highlights

- **Role-Based Architecture**: Separate authentication and authorization for Managers and Users
- **Real-Time Updates**: Auto-refresh dashboard every 5 seconds to reflect task status changes
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Modern UI/UX**: Smooth animations with Framer Motion and responsive design
- **Theme System**: Global dark/light mode with persistent state using next-themes
- **Type-Safe**: Built with TypeScript for enhanced developer experience

---

## ✨ Features

### For Managers (`/dashboard`)
- ✅ Create and assign tasks to team members
- ✅ Set task priorities (Low, Medium, High)
- ✅ Define deadlines and track progress
- ✅ View tasks by status (Pending/Completed)
- ✅ Real-time task updates with auto-refresh
- ✅ Manual refresh capability
- ✅ User management and selection

### For Team Members (`/userdashboard`)
- ✅ Personalized task dashboard
- ✅ View assigned tasks with priority indicators
- ✅ Mark tasks as complete
- ✅ Track completion history
- ✅ Overdue task warnings
- ✅ Task statistics overview

### Global Features
- ✅ Secure JWT authentication
- ✅ Dark/Light theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth page transitions
- ✅ Form validation
- ✅ Error handling and user feedback

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12.39.0](https://www.framer.com/motion/)
- **State Management**: [Zustand 5.0.13](https://github.com/pmndrs/zustand)
- **Theme**: [next-themes 0.4.6](https://github.com/pacocoursey/next-themes)

### Backend
- **Runtime**: Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9.6.2](https://mongoosejs.com/)
- **Authentication**: [JWT (jsonwebtoken 9.0.3)](https://github.com/auth0/node-jsonwebtoken)
- **Password Hashing**: [bcryptjs 3.0.3](https://github.com/dcodeIO/bcrypt.js)

### Development Tools
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js default)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskmaster.git
   cd taskmaster/collaborativetaskmanager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/collaborativetaskmanager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   ```

   **Important**: 
   - For production, generate a secure JWT secret using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - For MongoDB Atlas, use your connection string instead of localhost

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
collaborativetaskmanager/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/           # User login
│   │   │   └── register/        # User registration
│   │   ├── manager/             # Manager authentication
│   │   ├── tasks/               # Task CRUD operations
│   │   └── users/               # User management
│   ├── components/              # Reusable React components
│   │   ├── Navbar.tsx           # Global navigation
│   │   ├── TaskCard.tsx         # Task display component
│   │   ├── ThemeToggle.tsx      # Dark/Light mode toggle
│   │   └── ThemeProvider.tsx    # Theme context provider
│   ├── dashboard/               # Manager dashboard
│   │   └── page.tsx
│   ├── userdashboard/           # User dashboard
│   │   └── page.tsx
│   ├── user/                    # User authentication page
│   │   └── page.tsx
│   ├── store/                   # Zustand state management
│   │   └── useStore.ts
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── lib/                         # Database models and utilities
│   ├── mongodb.ts               # MongoDB connection
│   ├── User.ts                  # User model
│   ├── Manager.ts               # Manager model
│   └── Task.ts                  # Task model
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in git)
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── README.md                    # This file
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully."
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Logged in successfully.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Manager Authentication
```http
POST /api/manager
Content-Type: application/json

{
  "action": "login",  // or "register"
  "email": "manager@example.com",
  "password": "securepassword",
  "name": "Manager Name"  // only for registration
}
```

### Task Endpoints

#### Get Tasks
```http
GET /api/tasks?userId={userId}        # Get tasks for a user
GET /api/tasks?managerId={managerId}  # Get tasks created by manager
GET /api/tasks                        # Get all tasks
```

**Response:**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete project documentation",
      "description": "Write comprehensive README",
      "assignedTo": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdBy": "507f1f77bcf86cd799439013",
      "priority": "high",
      "status": "pending",
      "deadline": "2026-05-30T00:00:00.000Z",
      "updates": ["Task assigned by manager."],
      "createdAt": "2026-05-25T10:00:00.000Z",
      "updatedAt": "2026-05-25T10:00:00.000Z"
    }
  ]
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "assignedTo": "507f1f77bcf86cd799439012",
  "createdBy": "507f1f77bcf86cd799439013",
  "priority": "medium",
  "deadline": "2026-05-30",
  "updates": ["Initial task creation"]
}
```

#### Update Task
```http
PATCH /api/tasks
Content-Type: application/json

{
  "taskId": "507f1f77bcf86cd799439011",
  "updates": {
    "status": "completed",
    "updates": ["Marked as completed by user on 5/25/2026"]
  }
}
```

#### Get Users
```http
GET /api/users
```

**Response:**
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  ]
}
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### Manager Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "manager"),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  title: String (required),
  description: String,
  assignedTo: ObjectId (ref: 'User', required),
  createdBy: ObjectId (ref: 'Manager', required),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  status: String (enum: ['pending', 'completed'], default: 'pending'),
  deadline: Date (required),
  updates: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 Theme System

The application uses `next-themes` for seamless dark/light mode switching:

- **Persistent State**: Theme preference is saved in localStorage
- **System Preference**: Respects OS theme by default
- **No Flash**: Prevents white flash on page load in dark mode
- **Global Toggle**: Theme changes apply across all pages instantly

### Usage in Components

```typescript
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication with 24-hour expiry
- **Protected Routes**: Client-side route protection with automatic redirects
- **Input Validation**: Server-side validation for all API endpoints
- **CORS Protection**: API routes are protected against unauthorized access
- **Environment Variables**: Sensitive data stored in environment variables

---

## 🚦 Application Flow

### User Journey

1. **Landing Page** (`/`)
   - View features and benefits
   - Navigate to User or Manager portal

2. **User Authentication** (`/user`)
   - Register new account or login
   - Auto-redirect to user dashboard on success

3. **User Dashboard** (`/userdashboard`)
   - View assigned tasks
   - Mark tasks as complete
   - Track progress

### Manager Journey

1. **Manager Authentication** (`/dashboard`)
   - Register or login as manager
   - Access manager workspace

2. **Manager Dashboard** (`/dashboard`)
   - View all created tasks
   - Assign new tasks to team members
   - Monitor task completion
   - Auto-refresh every 5 seconds

---

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Formatting**: Consistent code style across the project

### Best Practices

- Use TypeScript interfaces for type safety
- Follow Next.js App Router conventions
- Keep components small and reusable
- Use server components where possible
- Implement proper error handling
- Add loading states for async operations

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Theme not switching
- **Solution**: Ensure you've restarted the dev server after adding ThemeProvider

**Issue**: MongoDB connection failed
- **Solution**: Check if MongoDB is running and MONGODB_URI is correct in `.env.local`

**Issue**: JWT authentication errors
- **Solution**: Verify JWT_SECRET is set in `.env.local` and is at least 32 characters

**Issue**: Tasks not loading
- **Solution**: Check browser console for errors and verify API routes are accessible

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/taskmanager` |
| `JWT_SECRET` | Secret key for JWT signing | `your-32-char-secret-key` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for the database solution
- The open-source community

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and MongoDB**

⭐ Star this repo if you find it helpful!

</div>
