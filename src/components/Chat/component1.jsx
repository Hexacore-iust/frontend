import React, { useState } from "react";
import { Box, Paper, IconButton, TextField } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { IoSend } from "react-icons/io5";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "سلام، من دستیار هوشمند هوشیار هستم؛ چطور کمکت کنم؟",
      direction: "ltr"
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: input.trim() },
    ]);
    setInput("");
  };

  return (
    <Box
      sx={{
        width: "100%",        // کل عرض ستون محتوا
        maxWidth: "100%",     // دیگه محدودش نمی‌کنیم
        height: "600px" ,
        alignSelf: "stretch",
        // ❌ دیگه margin-top نداره که از سایدبار پایین‌تر بیفته
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          minHeight: 320,      // یه ارتفاع معقول حداقلی
          borderRadius: 4,
          p: 2.5,
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
          fontFamily: "Vazirmatn, sans-serif",
          height: "600px"
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
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
                  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  fontSize: "0.98rem",
                  maxWidth: "90%",
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  bgcolor: m.from === "user" ? "#F8F8F8" : "#00C2A8",
                  color: m.from === "user" ? "text.primary" : "#ffffff",
                  lineHeight: "1.7",
                }}
              >
                {m.text}
              </Box>
            </Box>
          ))}
        </Box>

        <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 999,
              border: "1px solid #D0D0D0",
              px: 2,
              py: 0.75,
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <AttachFileIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ ml: 1 }}>
              <MicNoneIcon fontSize="small" />
            </IconButton>

            <TextField
              variant="standard"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                  fontSize: "0.95rem",
                  textAlign: "right",
                },
              }}
              placeholder="سوال بپرس..."
            />
          </Paper>

          <IconButton
            type="submit"
            size="medium"
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: input.trim() ? "#00C2A8" : "#E0E0E0",
              color: input.trim() ? "#fff" : "#999",
              '&:hover': {
                bgcolor: input.trim() ? "#00a896" : "#D5D5D5",
              },
              flexShrink: 0,
            }}
          >
            <IoSend style={{ fontSize: "1.4rem" }} />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
