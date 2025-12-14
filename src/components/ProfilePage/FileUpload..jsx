import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { baseUrl } from "../../config";
import axios from "axios";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [showFileBox, setShowFileBox] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchUploadedFiles(token);
  }, []);

  const fetchUploadedFiles = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/files/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      });
      setFiles(response.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles((prevFiles) => [
      ...prevFiles,
      ...Array.from(selectedFiles).map((file) => ({
        file: URL.createObjectURL(file),
        original_name: file.name,
        fileData: file,
      })),
    ]);
  };

  const handleFileDelete = async (fileId) => {
    try {
      await deleteFile(fileId, token);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleShowFileBox = () => {
    setShowFileBox((prevState) => !prevState);
  };

  const uploadFiles = async (files, token) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file.fileData);
    });

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/files/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Files uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const deleteFile = async (fileId, token) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/api/auth/files/${fileId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("File deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      console.error("No files selected for upload");
      return;
    }

    try {
      // Upload the new files
      const uploaded = await uploadFiles(files, token);

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
                        style={{ marginLeft: "10px" }}
                      >
                        حذف
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
