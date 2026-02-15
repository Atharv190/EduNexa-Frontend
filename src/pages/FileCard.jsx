// src/components/FileCard.jsx
import { Link } from "react-router-dom";

export default function FileCard({ file }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <h3 className="font-semibold">{file.title}</h3>
      <p className="text-sm text-gray-600">{file.subject}</p>
      <p className="text-xs text-gray-500 mt-2 line-clamp-3">
        {file.description}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/files/${file._id}`}
          className="text-blue-600"
        >
          View
        </Link>

        {/* ✅ AUTO DOWNLOAD – ORIGINAL FILE (PDF stays PDF) */}
        <a
          href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/files/download/${file._id}`}
          className="text-sm bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
        >
          Download
        </a>
      </div>
    </div>
  );
}
