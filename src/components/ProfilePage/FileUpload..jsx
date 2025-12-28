import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { baseUrl } from "../../config";
import { apiInstance } from "../../api/axios.js";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFileBox, setShowFileBox] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = () => {
    apiInstance.get("/api/auth/files/").then((response) => {
      if (response) {
        setFiles(response.data.files || []);
      }
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

    apiInstance.post("/api/auth/files/").then((response) => {
      console.log("Files uploaded successfully:", response.data);
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
    if (files.length === 0) {
      console.error("No files selected for upload");
      return;
    }

    try {
      const uploaded = uploadFiles(selectedFiles);

      const allFiles = [...uploaded.files, ...files];

      setFiles(allFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

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
                  {files.map((file, index) => (
                    <li key={index}>
                      {/* Display file name */}

                      {file.file && (
                        <img
                          src={`${baseUrl}${file.file}`}
                          // alt={file.original_name}
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
                </Button>
              </div>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
