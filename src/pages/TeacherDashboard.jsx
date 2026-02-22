import { useEffect, useState, useContext, useCallback } from "react";
import {
  uploadFile,
  getMyFiles,
  getAllFiles,
  deleteFile,
} from "../api/fileApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  LogOut,
  BookOpen,
  Sparkles,
  User,
} from "lucide-react";
import api from "../api/axios";

const handleDownload = (fileId) => {
  window.location.href = `${api.defaults.baseURL}/files/download/${fileId}`;
};


export default function TeacherDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [view, setView] = useState("my");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  


  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });

  /* ================= FETCH FILES ================= */
 const fetchFiles = useCallback(async () => {
  try {
    const res = view === "my" ? await getMyFiles() : await getAllFiles();
    setFiles(res.data.files || []);
  } catch (err) {
    console.error(err);
    alert("Failed to load files");
  }
}, [view]);


 useEffect(() => {
  if (user?.role === "teacher") {
    fetchFiles();
  }
}, [fetchFiles, user]);


  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      setForm((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return alert("Please select a file");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      await uploadFile(data);
      setForm({ title: "", subject: "", description: "", file: null });
      fetchFiles();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE FILE ================= */
 const handleDelete = async (fileId) => {
  try {
    await deleteFile(fileId);
    setFiles((prev) => prev.filter((f) => f._id !== fileId));
  } catch (err) {
  console.error(err);
  alert("Failed to delete file");
}
};

const handleOpen = async (fileId, fileName) => {
  try {
    const res = await api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName || "Study Material"}</title>
          <style>
            html, body {
              margin: 0;
              height: 100%;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${pdfUrl}"></iframe>
        </body>
      </html>
    `;

    const htmlBlob = new Blob([html], { type: "text/html" });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    window.open(htmlUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
      URL.revokeObjectURL(htmlUrl);
    }, 15000);
  } catch (err) {
    console.error(err);
    alert("Failed to open file");
  }
};


  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl">
              <Sparkles className="text-indigo-400" />
            </div>
            <div>
              <h1 className="font-black text-lg">Teacher Dashboard</h1>
              <p className="text-xs text-slate-400">Manage study materials</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        {/* UPLOAD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <UploadCloud className="text-indigo-400" />
            Upload Material
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="input"
            />

            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="input"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input resize-none"
              rows={3}
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition
                ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/20"
                }`}
            >
              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="block cursor-pointer">
                <UploadCloud className="mx-auto text-indigo-400 mb-2" />
                <p className="text-sm">
                  {form.file
                    ? form.file.name
                    : "Drag & drop or click to upload"}
                </p>
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-bold"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>

        {/* FILES */}
        <div className="lg:col-span-2">
          <div className="flex gap-3 mb-6">
            {["my", "all"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-5 py-2 rounded-xl font-semibold transition ${
                  view === v
                    ? "bg-indigo-500 text-white"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {v === "my" ? "My Files" : "All Files"}
              </button>
            ))}
          </div>

          {files.length === 0 ? (
            <div className="h-64 flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl">
              No files available
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold truncate">{file.title}</h3>
                      <p className="text-xs text-slate-400">{file.subject}</p>

                      {view === "all" && (
                        <p className="text-xs flex items-center gap-1 text-slate-500">
                          <User size={12} />
                          {file.createdBy?.username || "Unknown"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm font-semibold flex-wrap">

  <button
  onClick={() => handleOpen(file._id, file.title)}
  className="text-indigo-400 hover:underline"
>
  Open
</button>

  {/* ✅ DOWNLOAD (ALL FILES) */}
  <button
    onClick={() => handleDownload(file._id)}
    className="text-sky-400 hover:underline"
  >
    Download
  </button>

  <button
    onClick={() => navigate(`/files/${file._id}/summary`)}
    className="text-green-400 hover:underline"
  >
    Summary
  </button>

  <button
    onClick={() => navigate(`/files/${file._id}/quiz`)}
    className="text-purple-400 hover:underline"
  >
    Quiz
  </button>

  {/* 🔥 DELETE ONLY MY FILES */}
  {view === "my" && (
    <button
      onClick={() => handleDelete(file._id)}
      className="text-red-400 hover:underline"
    >
      Delete
    </button>
  )}
</div>

                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
        }
        .input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}
