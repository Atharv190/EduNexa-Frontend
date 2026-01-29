import api from "./axios";

export const uploadFile = (data) => {
  return api.post("/files", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyFiles = () => {
  return api.get("/files/my", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getAllFiles = () => {
  return api.get("/files", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

/* ✅ FINAL FIX: DELETE FILE */
export const deleteFile = (fileId) => {
  return api.delete(`/files/${fileId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
