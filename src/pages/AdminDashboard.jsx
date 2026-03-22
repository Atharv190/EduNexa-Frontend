import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Search, 
  Shield,
  Sparkles,
  Crown,
  Star,
  Zap,
  XCircle,
  UserMinus,
  TrendingUp,
  Activity,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("teachers");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, sRes] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/admin/students")
      ]);
      setTeachers(tRes.data.teachers);
      setStudents(sRes.data.students);
    } catch (err) {
      console.error(err);
      showNotification("❌ Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const approveTeacher = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      showNotification("✅ Teacher approved successfully", "success");
      fetchData();
    } catch (err) {
      showNotification("❌ Approval failed", "error");
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/user/${id}`);
      showNotification("🗑️ User deleted successfully", "success");
      fetchData();
      setShowModal(false);
    } catch (err) {
      showNotification("❌ Deletion failed", "error");
    }
  };

  const pendingTeachers = teachers.filter(t => !t.isApproved).length;
  const approvedTeachers = teachers.filter(t => t.isApproved).length;
  const totalUsers = teachers.length + students.length;
  const approvalRate = teachers.length > 0 ? Math.round((approvedTeachers / teachers.length) * 100) : 0;

  const filteredTeachers = teachers.filter(t =>
    t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60, damping: 15 } }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.3, type: "spring", stiffness: 100 }
    })
  };

  const floatingOrb = {
    animate: {
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0C12] via-[#0F1117] to-[#0A0C12] overflow-x-hidden">
      
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-3s' }}
          className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-purple-500/8 blur-[150px] pointer-events-none"
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-1.5s' }}
          className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full border border-white/5 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              notification.type === "success" 
                ? "bg-gradient-to-r from-emerald-500/90 to-green-500/90 border-emerald-400" 
                : "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400"
            } text-white font-medium`}
          >
            {notification.type === "success" ? <Sparkles size={20} /> : <XCircle size={20} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-[#0F1117] to-[#0A0C12] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30"
                >
                  <UserMinus className="text-white" size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Delete User?</h3>
                <p className="text-gray-400 mb-6">
                  This action cannot be undone. The user will be permanently removed from the system.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition font-medium border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(selectedUser?._id)}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition font-medium shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <motion.div 
                className="flex items-center gap-3 mb-2"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
              >
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/30"
                >
                  <Crown className="text-white" size={28} />
                </motion.div>
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </motion.div>
              <p className="text-gray-400 mt-2 flex items-center gap-2 ml-12">
                <Shield size={16} className="text-indigo-400" />
                Manage teachers, students, and platform access with complete control
              </p>
            </div>
            
            {/* Live Stats Badge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-indigo-500/20"
            >
              <Activity size={16} className="text-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">Live Monitoring</span>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {[
            { icon: Users, label: "Total Teachers", value: teachers.length, gradient: "from-blue-500 to-cyan-500", change: "+12%", iconBg: "from-blue-500 to-cyan-500" },
            { icon: GraduationCap, label: "Total Students", value: students.length, gradient: "from-green-500 to-emerald-500", change: "+8%", iconBg: "from-green-500 to-emerald-500" },
            { icon: Clock, label: "Pending Approvals", value: pendingTeachers, gradient: "from-orange-500 to-red-500", change: `${pendingTeachers} waiting`, iconBg: "from-orange-500 to-red-500" },
            { icon: TrendingUp, label: "Approval Rate", value: `${approvalRate}%`, gradient: "from-purple-500 to-pink-500", change: `${approvalRate}% verified`, iconBg: "from-purple-500 to-pink-500" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              <div className="relative overflow-hidden bg-[#0F1117]/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`p-3 bg-gradient-to-r ${stat.iconBg} rounded-xl shadow-lg`}
                  >
                    <stat.icon className="text-white" size={28} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 p-1.5 bg-[#0F1117]/60 backdrop-blur-sm rounded-2xl border border-white/10">
            {[
              { id: "teachers", label: "Teachers", icon: Users, count: teachers.length, color: "from-blue-500 to-cyan-500" },
              { id: "students", label: "Students", icon: GraduationCap, count: students.length, color: "from-green-500 to-emerald-500" }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-white/10"
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#0F1117]/60 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64 text-white placeholder-gray-500 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-indigo-400" size={24} />
              </div>
            </motion.div>
            <p className="mt-4 text-gray-400">Loading dashboard data...</p>
          </div>
        )}

        {/* Teachers Table */}
        {!loading && activeTab === "teachers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredTeachers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-[#0F1117]/60 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <Users className="mx-auto text-gray-500 mb-3" size={48} />
                <p className="text-gray-400 text-base">No teachers found</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-[#0F1117]/60 backdrop-blur-sm border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Teacher</th>
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Email</th>
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Joined</th>
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Status</th>
                      <th className="py-4 px-6 text-center text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher, idx) => (
                      <motion.tr
                        key={teacher._id}
                        custom={idx}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group"
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg"
                            >
                              {teacher.username[0].toUpperCase()}
                            </motion.div>
                            <span className="font-medium text-white">{teacher.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-gray-300">{teacher.email}</td>
                        <td className="py-3 px-6 text-gray-400 text-sm">
                          {new Date(teacher.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-3 px-6">
                          {teacher.isApproved ? (
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                            >
                              <CheckCircle size={12} /> Approved
                            </motion.span>
                          ) : (
                            <motion.span 
                              whileHover={{ scale: 1.05 }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
                            >
                              <Clock size={12} /> Pending
                            </motion.span>
                          )}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {!teacher.isApproved && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => approveTeacher(teacher._id)}
                                className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1"
                              >
                                <CheckCircle size={14} /> Approve
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedUser(teacher);
                                setShowModal(true);
                              }}
                              className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Students Table */}
        {!loading && activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredStudents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-[#0F1117]/60 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <GraduationCap className="mx-auto text-gray-500 mb-3" size={48} />
                <p className="text-gray-400 text-base">No students found</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-[#0F1117]/60 backdrop-blur-sm border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Student</th>
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Email</th>
                      <th className="py-4 px-6 text-left text-gray-300 font-semibold">Joined</th>
                      <th className="py-4 px-6 text-center text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, idx) => (
                      <motion.tr
                        key={student._id}
                        custom={idx}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg"
                            >
                              {student.username[0].toUpperCase()}
                            </motion.div>
                            <span className="font-medium text-white">{student.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-gray-300">{student.email}</td>
                        <td className="py-3 px-6 text-gray-400 text-sm">
                          {new Date(student.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedUser(student);
                                setShowModal(true);
                              }}
                              className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Delete
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-6 border-t border-white/10"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>© 2025 EduNexa Admin</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-indigo-400" /> 
                Secure Platform
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-yellow-400" /> 
                Real-time Analytics
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={12} className="text-blue-400" /> 
                Live Monitoring
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star size={14} className="text-yellow-500" />
              <span className="text-gray-400">Total Users: <span className="text-white font-semibold">{totalUsers}</span></span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">Active Teachers: <span className="text-green-400 font-semibold">{approvedTeachers}</span></span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">Pending: <span className="text-orange-400 font-semibold">{pendingTeachers}</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}