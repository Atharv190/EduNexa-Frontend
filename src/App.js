import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Files from "./pages/Files";
import FileDetails from "./pages/FileDetails";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import AdminDashboard from "./pages/AdminDashboard";
const user = JSON.parse(localStorage.getItem("user"));

<Route
  path="/admin"
  element={
    user?.role === "admin" ? (
      <AdminDashboard />
    ) : (
      <Navigate to="/" />
    )
  }
/>


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

            <Route path="/files" element={<Files />} />
            <Route path="/files/:id" element={<FileDetails />} />
            <Route path="/files/:fileId/summary" element={<Summary />} />
            <Route path="/files/:fileId/quiz" element={<Quiz />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
