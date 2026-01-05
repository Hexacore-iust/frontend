import { createTheme } from "@mui/material/styles";
import { faIR as coreFaIR } from "@mui/material/locale";
import { faIR as pickersFaIR } from "@mui/x-date-pickers/locales";

const theme = createTheme(
  {
    direction: "rtl",
    typography: {
      fontFamily: [
        "Vazirmatn",
        "system-ui",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "sans-serif",
      ].join(","),
    },
  },
  coreFaIR,
  pickersFaIR
);

export default theme;
