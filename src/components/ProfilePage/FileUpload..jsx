import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { baseUrl } from "../../config";
import { apiInstance } from "../../api/axios.js";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFileBox, setShowFileBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const buildFileUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    console.log(`${baseUrl}${cleanPath}`);
    return `${baseUrl}${cleanPath}`;
  };

  const fetchUploadedFiles = () => {
    return apiInstance.get("/api/auth/files/").then((response) => {
      setFiles(response?.data?.files || []);
    });
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files;
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      ...Array.from(newFile).map((file) => ({
        file: URL.createObjectURL(file),
        original_name: file.name,
        fileData: file,
      })),
    ]);
  };

  const handleFileDelete = (fileId) => {
    try {
      deleteFile(fileId);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const handleNotUploadedFileDelete = (fileId) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  const handleShowFileBox = () => {
    setShowFileBox((prevState) => !prevState);
  };

  const uploadFiles = (selectedFiles) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file.fileData);
    });

    return apiInstance.post("/api/auth/files/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const deleteFile = (fileId) => {
    apiInstance.delete(`/api/auth/files/${fileId}/delete/`, fileId);
    // .then((response) => {
    //   if (response) {
    //     return response.data;
    //   }
    // });
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      console.error("No files selected for upload");
      return;
    }

    setLoading(true);
    setSuccess(false);

    uploadFiles(selectedFiles)
      .then(() => {
        setSuccess(true);
        setSelectedFiles([]);
        fetchUploadedFiles();
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="file-upload">
      <h5 className="profile-card__header">
        به دستیار هوشمند کمک کن!
        {showFileBox ? (
          <ExpandLessIcon onClick={handleShowFileBox} />
        ) : (
          <ExpandMoreIcon onClick={handleShowFileBox} />
        )}
      </h5>
      {showFileBox && (
        <>
          <p>
            با بارگذاری و تکمیل اطلاعات شخصی خود، به مدل هوش مصنوعی ما کمک
            می‌کنید تا تحلیل‌ها و پیشنهادهای ارائه‌شده را بر اساس ویژگی‌ها،
            نیازها و اهداف فردی شما به‌صورت دقیق‌تر و شخصی‌سازی‌شده تنظیم کند.
            تمامی داده‌های واردشده صرفاً برای بهبود کیفیت تجربه کاربری استفاده
            می‌شوند و مطابق با اصول محرمانگی و حریم خصوصی نگهداری خواهند شد.
          </p>

          {/* File input for selecting files */}
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="file-upload-input"
            />
            <div>
              {files.length > 0 && (
                <ul>
                  {files.map((file) => (
                    <li key={file.id}>
                      {/* Display file name */}
                      {
                        <img
                          src={buildFileUrl(file.file)}
                          // alt={file.original_name}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                            marginLeft: "10px",
                            marginRight: "10px",
                          }}
                        />
                      }
                      {file.original_name}

                      <Button
                        onClick={() => handleFileDelete(file.id)}
                        style={{ marginLeft: "10px", color: "#ff9d00" }}
                      >
                        حذف
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {selectedFiles.length > 0 && (
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>
                      {/* Display file name */}
                      {file.file && (
                        <img
                          src={`${file.file}`}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                            marginLeft: "10px",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      {file.original_name}

                      <Button
                        onClick={() => handleNotUploadedFileDelete(file.id)}
                        style={{ marginLeft: "10px", color: "#ff9d00" }}
                      >
                        انصراف از آپلود
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label htmlFor="file-upload-input">
              <div style={{ display: "flex", gap: "15px" }}>
                <Button
                  variant="contained"
                  component="span"
                  style={{ backgroundColor: "#00c48c" }}
                >
                  اضافه کردن فایل
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#00c48c",
                  }}
                  onClick={handleFileSubmit}
                >
                  ثبت فایل
                  {loading && (
                    <CircularProgress
                      size={18}
                      color="inherit"
                      style={{ marginRight: 8 }}
                    />
                  )}
                </Button>
              </div>
            </label>
            {success && (
              <Alert severity="success" sx={{ width: "fit-content", mt: 2 }}>
                فایل‌ها با موفقیت آپلود شدند.
              </Alert>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
