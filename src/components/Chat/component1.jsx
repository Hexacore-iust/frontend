// src/pages/ChatPage.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicNoneIcon from "@mui/icons-material/MicNone";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "سلام، من دستیار هوشمند Hexacore هستم؛ چطور کمکت کنم؟",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // فقط ماک: پیام کاربر به لیست اضافه می‌شود
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: input.trim() },
    ]);
    setInput("");
  };

  return (
    <Box
      sx={{
        direction: "rtl",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#FFFFFF",
        borderRadius: 3,
        border: "1px solid #F0F0F0",
        px: 2.5,
        py: 2,
      }}
    >
      {/* ناحیه پیام‌ها */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: "flex",
              justifyContent:
                m.from === "user" ? "flex-start" : "flex-end",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                borderRadius: 3,
                px: 1.8,
                py: 1,
                bgcolor: m.from === "user" ? "#F8F8F8" : "#00C2A8",
                color: m.from === "user" ? "text.primary" : "#ffffff",
                fontSize: ".9rem",
                fontFamily: "Vazirmatn, sans-serif",
              }}
            >
              {m.text}
            </Box>
          </Box>
        ))}
      </Box>

      {/* اینپوت پایین صفحه */}
      <Box component="form" onSubmit={handleSend} sx={{ mt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 999,
            border: "1px solid #D0D0D0",
            px: 2,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            bgcolor: "#FFFFFF",
          }}
        >
          {/* آیکن‌ها (سمت چپ در RTL) */}
          <IconButton size="small" sx={{ ml: 0.5 }}>
            <AttachFileIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ ml: 1 }}>
            <MicNoneIcon fontSize="small" />
          </IconButton>

          {/* فیلد متن (سمت راست) */}
          <TextField
            variant="standard"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: "Vazirmatn, sans-serif",
                fontSize: ".9rem",
                textAlign: "right",
              },
            }}
            placeholder="سوال بپرس..."
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;
