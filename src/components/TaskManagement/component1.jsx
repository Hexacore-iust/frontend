import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";

const ScheduleDateBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#F8F8F8",
        borderRadius: 3,
        px: 3,
        py: 1.8,
        direction: "rtl",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "none",
        fontFamily: "Vazirmatn, sans-serif",
      }}
    >

      {/* آیکن‌ها (سمت راست) */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          sx={{
            bgcolor: "#F4F4F4",
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#EDEDED" },
          }}
        >
          <ShareIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            bgcolor: "#F4F4F4",
            borderRadius: 2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#EDEDED" },
          }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* تاریخ (سمت چپ) */}
      <Box sx={{ textAlign: "left" }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          شنبه ۱ آذر ۱۴۰۴
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: ".85rem",
          }}
        >
          22 November 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default ScheduleDateBar;
