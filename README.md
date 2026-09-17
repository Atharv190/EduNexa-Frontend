# 🎓 EduNexa — Smart Learning Platform

**EduNexa** is a modern, AI-powered Smart Learning Platform built to provide students with an organized and interactive learning experience. The platform enables students to access educational resources, generate AI-powered summaries and quizzes, while instructors can manage learning materials and administrators can manage the platform.

This repository contains the **frontend application** of EduNexa, developed using React.js and Vite.

## 🚀 Features

* 🔐 User authentication with email OTP verification
* 👥 Role-based interface for Students, Instructors, and Administrators
* 📚 Browse and access learning resources
* 📤 Instructor resource upload and management
* 🤖 AI-powered content summarization
* 📝 AI-generated quizzes from learning materials
* 🛡️ Protected routes and role-based access
* 🔄 REST API integration with Axios
* 📱 Responsive and user-friendly interface
* 🎯 Dedicated dashboards based on user roles

## 👥 User Roles

### 👨‍🎓 Student

* Access approved learning resources
* View and download study materials
* Generate AI-powered summaries
* Generate and attempt quizzes

### 👨‍🏫 Instructor

* Upload learning materials
* Manage educational resources
* Track resource approval status

### 👨‍💼 Administrator

* Manage users
* Manage instructors
* Review and approve learning resources
* Manage platform activities

## 🛠️ Tech Stack

* **React.js** — UI development
* **Vite** — Frontend build tool
* **JavaScript** — Application logic
* **Bootstrap** — Responsive UI
* **Axios** — REST API communication
* **React Router** — Client-side routing
* **JWT** — Authentication
* **HTML5 & CSS3** — Structure and styling

## 🔄 Application Workflow

```text
User Registration
       ↓
Email OTP Verification
       ↓
Login
       ↓
JWT Authentication
       ↓
Role-Based Dashboard
       ↓
Access Platform Features
```

### Student Learning Workflow

```text
Student
   ↓
Browse Learning Resources
   ↓
Select Material
   ↓
View / Download
   ↓
Generate AI Summary
   ↓
Generate Quiz
   ↓
Attempt Quiz
```

## 🤖 AI-Powered Learning

EduNexa integrates AI functionality to improve the learning experience.

### AI Summarization

Students can generate concise summaries from learning materials, helping them understand lengthy content and revise important concepts efficiently.

### AI Quiz Generation

The platform can generate quiz questions from learning materials, allowing students to test their understanding and practice important concepts.

## 🔗 Backend Integration

The frontend communicates with the EduNexa backend through RESTful APIs.

**Backend Repository:**
`https://github.com/Atharv190/EduNexa-Backend`

The frontend uses Axios to communicate with APIs for:

* Authentication
* User management
* Learning resources
* File operations
* AI summarization
* Quiz generation
* Role-based operations

## 🔒 Security

The frontend implements:

* Protected routes
* JWT-based authentication
* Role-based navigation
* Authentication state handling
* Secure API communication
* Environment-based API configuration

## ⚙️ Installation

### Prerequisites

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_LINK
cd EduNexa-Frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
VITE_API_URL=YOUR_BACKEND_API_URL
```

### Run the Application

```bash
npm run dev
```

The application will start on the Vite development server.
