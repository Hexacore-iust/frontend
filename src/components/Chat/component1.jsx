import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MicNoneIcon from "@mui/icons-material/MicNone";
import StopIcon from "@mui/icons-material/Stop";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddIcon from "@mui/icons-material/Add";
import { IoSend, IoPlay, IoPause } from "react-icons/io5";

// =====================
// MOCK CHAT API
// =====================
const mockChatApi = (payloadType = "text") =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (payloadType === "audio") resolve("🎧 پیام صوتی دریافت شد.");
      else if (payloadType === "file") resolve("📎 فایل شما دریافت شد.");
      else resolve("🤖 پیام شما دریافت شد.");
    }, 600);
  });

// helpers
const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

const formatTime = (sec) => {
  if (sec == null || Number.isNaN(sec)) return "--:--";
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

const safeJsonParse = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const ChatPage = () => {
  // =====================
  // Multi chat storage (MOCK): localStorage
  // =====================
  const STORAGE_KEY = "hooshyar_mock_chats_v1";

  const defaultBotHello = useMemo(
    () => ({
      id: 1,
      from: "bot",
      type: "text",
      text: "سلام، من دستیار هوشمند هوشیار هستم؛ چطور کمکت کنم؟",
    }),
    []
  );

  const [chats, setChats] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
    if (saved?.chats?.length) return saved.chats;

    // initial mock chats
    const now = Date.now();
    return [
      {
        id: `chat_${now}`,
        title: "گفتگو 1",
        createdAt: now,
        updatedAt: now,
        messages: [defaultBotHello],
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
    if (saved?.activeChatId) return saved.activeChatId;
    return null;
  });

  // persist
  useEffect(() => {
    const payload = { chats, activeChatId: activeChatId || chats?.[0]?.id || null };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [chats, activeChatId]);

  // ensure active chat exists
  useEffect(() => {
    if (!chats.length) return;

    if (!activeChatId) {
      setActiveChatId(chats[0].id);
      return;
    }

    const exists = chats.some((c) => c.id === activeChatId);
    if (!exists) setActiveChatId(chats[0].id);
  }, [chats, activeChatId]);

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  // =====================
  // UI states
  // =====================
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Attach file
  const fileInputRef = useRef(null);

  // cleanup objectURLs on unmount
  const chatsRef = useRef(chats);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  useEffect(() => {
    return () => {
      const all = chatsRef.current || [];
      all.forEach((chat) => {
        (chat.messages || []).forEach((m) => {
          if (m?.type === "audio" && m?.audioUrl) URL.revokeObjectURL(m.audioUrl);
          if (m?.type === "file" && m?.fileUrl) URL.revokeObjectURL(m.fileUrl);
        });
      });
    };
  }, []);

  // =====================
  // Chat actions
  // =====================
  const createNewChat = () => {
    const now = Date.now();
    const newChat = {
      id: `chat_${now}`,
      title: `گفتگو ${chats.length + 1}`,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: now + 1,
          from: "bot",
          type: "text",
          text: "سلام! یک گفتگوی جدید شروع شد. چطور کمکت کنم؟",
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInput("");
  };

  const deleteChat = (chatId) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== chatId);

      // اگر چت فعال حذف شد، برو روی اولین چت باقی‌مانده
      if (activeChatId === chatId) {
        setActiveChatId(next[0]?.id || null);
      }
      return next;
    });
  };

  const updateChatMessages = (chatId, updater) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const nextMessages = updater(c.messages || []);
        return { ...c, messages: nextMessages, updatedAt: Date.now() };
      })
    );
  };

  const addMessageToActive = (msg) => {
    if (!activeChat?.id) return;
    updateChatMessages(activeChat.id, (msgs) => [...msgs, msg]);
  };

  // =====================
  // Text send
  // =====================
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || isRecording) return;

    const text = input.trim();
    addMessageToActive({ id: Date.now(), from: "user", type: "text", text });
    setInput("");

    setLoading(true);
    try {
      const reply = await mockChatApi("text");
      addMessageToActive({ id: Date.now() + 1, from: "bot", type: "text", text: reply });

      // update title on first user message
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChat.id) return c;
          const hasUser = (c.messages || []).some((m) => m.from === "user" && m.type === "text");
          if (hasUser) return c;
          return { ...c, title: text.length > 18 ? `${text.slice(0, 18)}…` : text };
        })
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Attach file
  // =====================
  const onPickFile = () => fileInputRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || loading || isRecording) return;

    const fileUrl = URL.createObjectURL(file);
    addMessageToActive({
      id: Date.now(),
      from: "user",
      type: "file",
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl,
      // NOTE: file itself is not serializable for localStorage; keep for runtime only if needed:
      // file,
    });
    e.target.value = "";

    setLoading(true);
    try {
      const reply = await mockChatApi("file");
      addMessageToActive({ id: Date.now() + 1, from: "bot", type: "text", text: reply });
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // Voice recording
  // =====================
  const startRecording = async () => {
    if (loading) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      } catch {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        if (recordTimerRef.current) clearInterval(recordTimerRef.current);
        recordTimerRef.current = null;

        const blobType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: blobType });
        chunksRef.current = [];

        const audioUrl = URL.createObjectURL(audioBlob);

        // IMPORTANT: Blob cannot be persisted in localStorage; we store only url for current session.
        addMessageToActive({
          id: Date.now(),
          from: "user",
          type: "audio",
          audioUrl,
          audioMime: blobType,
          // audioBlob,
        });

        setLoading(true);
        try {
          const reply = await mockChatApi("audio");
          addMessageToActive({ id: Date.now() + 1, from: "bot", type: "text", text: reply });
        } finally {
          setLoading(false);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch {
      addMessageToActive({
        id: Date.now(),
        from: "bot",
        type: "text",
        text: "دسترسی به میکروفون ممکن نیست یا مرورگر پشتیبانی نمی‌کند.",
      });
    }
  };

  const stopRecording = () => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (!isRecording) startRecording();
    else stopRecording();
  };

  // =====================
  // Components
  // =====================
  const Bubble = ({ children, from }) => (
    <Box
      sx={{
        maxWidth: "92%",
        borderRadius: 3,
        px: 2,
        py: 1.25,
        bgcolor: from === "user" ? "#F8F8F8" : "#00C2A8",
        color: from === "user" ? "text.primary" : "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </Box>
  );

  // Telegram-like simple audio pill (no header/footer)
  const AudioMessage = ({ msg }) => {
    const audioRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [current, setCurrent] = useState(0);

    const BAR_COUNT = 48;
    const peaks = useMemo(
      () => Array.from({ length: BAR_COUNT }, () => Math.random() * 0.8 + 0.2),
      []
    );

    const togglePlay = async () => {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) {
        try {
          await a.play();
          setIsPlaying(true);
        } catch {}
      } else {
        a.pause();
        setIsPlaying(false);
      }
    };

    const onTimeUpdate = () => {
      const a = audioRef.current;
      if (!a) return;
      setCurrent(a.currentTime || 0);
    };

    const onLoadedMeta = (e) => {
      const d = e.currentTarget.duration;
      if (Number.isFinite(d)) setDuration(d);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrent(0);
    };

    const seekByClick = (idx) => {
      const a = audioRef.current;
      if (!a || !duration) return;
      const t = (idx / (BAR_COUNT - 1)) * duration;
      a.currentTime = t;
      setCurrent(t);
    };

    const playedBars = duration ? Math.floor((current / duration) * BAR_COUNT) : 0;

    return (
      <Box sx={{ minWidth: 320 }}>
        <Box
          sx={{
            borderRadius: 999,
            bgcolor: "#FFFFFF",
            p: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <IconButton
            onClick={togglePlay}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "#1F7AE0",
              color: "#fff",
              "&:hover": { bgcolor: "#1F7AE0" },
            }}
          >
            {isPlaying ? (
              <IoPause style={{ fontSize: 22 }} />
            ) : (
              <IoPlay style={{ fontSize: 22, marginLeft: 2 }} />
            )}
          </IconButton>

          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: "3px", height: 42 }}>
            {peaks.map((p, i) => {
              const h = Math.round(10 + p * 26);
              const played = i <= playedBars;
              return (
                <Box
                  key={i}
                  onClick={() => seekByClick(i)}
                  sx={{
                    width: 3,
                    height: h,
                    borderRadius: 999,
                    bgcolor: played ? "rgba(31,122,224,0.95)" : "rgba(31,122,224,0.25)",
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </Box>

          <Box sx={{ minWidth: 52, textAlign: "right" }}>
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
              {formatTime(Math.max(0, duration - current))}
            </Typography>
          </Box>
        </Box>

        <audio
          ref={audioRef}
          src={msg.audioUrl}
          onLoadedMetadata={onLoadedMeta}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          style={{ display: "none" }}
        />
      </Box>
    );
  };

  const FileMessage = ({ msg }) => {
    const isImage = msg.fileType?.startsWith("image/");
    return (
      <Box sx={{ minWidth: 260 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
          <InsertDriveFileIcon fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
            فایل ضمیمه
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
            {formatBytes(msg.fileSize)}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            p: 1,
            bgcolor: msg.from === "user" ? "#EFEFEF" : "rgba(255,255,255,0.18)",
          }}
        >
          <Typography sx={{ fontSize: 13, wordBreak: "break-word" }}>
            {msg.fileName}
          </Typography>

          {isImage && (
            <Box sx={{ mt: 1, borderRadius: 2, overflow: "hidden" }}>
              <img src={msg.fileUrl} alt={msg.fileName} style={{ width: "100%", display: "block" }} />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <a
              href={msg.fileUrl}
              download={msg.fileName}
              style={{
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 800,
                color: msg.from === "user" ? "#00A896" : "#fff",
              }}
            >
              دانلود
            </a>
            <Divider orientation="vertical" flexItem />
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 800,
                color: msg.from === "user" ? "#00A896" : "#fff",
              }}
            >
              باز کردن
            </a>
          </Box>
        </Paper>
      </Box>
    );
  };

  // =====================
  // Layout
  // =====================
  return (
    <Box
      sx={{
        width: "100%",
        height: 650,
        display: "flex",
        gap: 2,
        alignSelf: "stretch",
        fontFamily: "Vazirmatn, sans-serif",
        direction: "rtl",
      }}
    >
      {/* Sidebar chats */}
      <Paper
        elevation={3}
        sx={{
          width: 280,
          borderRadius: 4,
          p: 1.25,
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 14, fontFamily: "Vazirmatn, sans-serif" }}>
            گفتگوها
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="گفتگوی جدید">
            <IconButton onClick={createNewChat} size="small" sx={{ bgcolor: "rgba(0,0,0,0.04)" }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <List dense sx={{ p: 0 }}>
            {chats.map((c) => (
              <ListItemButton
                key={c.id}
                selected={c.id === activeChatId}
                onClick={() => setActiveChatId(c.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.Mui-selected": { bgcolor: "rgba(0, 194, 168, 0.12)" },
                  "&.Mui-selected:hover": { bgcolor: "rgba(0, 194, 168, 0.16)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34 }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                </ListItemIcon>

                <ListItemText
                  sx={{ flex: 1 }}
                  primary={
                    <Typography sx={{ fontSize: 13, fontWeight: 800, fontFamily: "Vazirmatn, sans-serif" }}>
                      {c.title || "بدون عنوان"}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: 12, opacity: 0.75, fontFamily: "Vazirmatn, sans-serif" }}>
                      {(c.messages || []).length} پیام
                    </Typography>
                  }
                />

                <Tooltip title="حذف گفتگو">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(c.id);
                    }}
                    sx={{ ml: 0.5 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Paper>

      {/* Chat panel */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          borderRadius: 4,
          p: 2.5,
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          direction: "rtl",
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontWeight: 900, fontSize: 14, fontFamily: "Vazirmatn, sans-serif" }}>
            {activeChat?.title || "گفتگو"}
          </Typography>
          
          
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: "auto", mb: 2, pr: 0.5 }}>
          {(activeChat?.messages || []).map((m) => (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: m.from === "user" ? "flex-start" : "flex-end",
                mb: 1.5,
              }}
            >
              <Bubble from={m.from}>
                {m.type === "text" && (
                  <Typography sx={{ fontSize: "0.98rem", lineHeight: 1.8, whiteSpace: "pre-wrap" ,fontFamily: "Vazirmatn, sans-serif",}}>
                    {m.text}
                  </Typography>
                )}

                {m.type === "audio" && <AudioMessage msg={m} />}

                {m.type === "file" && <FileMessage msg={m} />}
              </Bubble>
            </Box>
          ))}
        </Box>

        {/* Input bar */}
        <Box component="form" onSubmit={handleSend} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              gap: 0.5,
            }}
          >
            <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={onFileSelected} />

            <Tooltip title="ضمیمه فایل">
              <span>
                <IconButton size="small" sx={{ ml: 0.5 }} onClick={onPickFile} disabled={loading || isRecording}>
                  <AttachFileIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title={isRecording ? "توقف ضبط" : "ضبط پیام صوتی"}>
              <span>
                <IconButton size="small" sx={{ ml: 0.5 }} onClick={toggleRecording} disabled={loading}>
                  {isRecording ? <StopIcon fontSize="small" /> : <MicNoneIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>

            {isRecording ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#E53935",
                    boxShadow: "0 0 0 4px rgba(229,57,53,0.15)",
                  }}
                />
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  در حال ضبط… {formatTime(recordSeconds)}
                </Typography>
              </Box>
            ) : (
              <TextField
                variant="standard"
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: "0.95rem",
                    textAlign: "right",
                  },
                }}
                placeholder={loading ? "در حال پردازش..." : "سوال بپرس..."}
                disabled={loading}
              />
            )}
          </Paper>

          <IconButton
            type="submit"
            size="medium"
            disabled={!input.trim() || loading || isRecording}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: input.trim() && !loading && !isRecording ? "#00C2A8" : "#E0E0E0",
              color: input.trim() && !loading && !isRecording ? "#fff" : "#999",
              "&:hover": {
                bgcolor: input.trim() && !loading && !isRecording ? "#00a896" : "#D5D5D5",
              },
              flexShrink: 0,
            }}
          >
            {loading ? <CircularProgress size={20} /> : <IoSend style={{ fontSize: "1.4rem" }} />}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
