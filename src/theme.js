import { createTheme } from "@mui/material/styles";
import { faIR as coreFaIR } from "@mui/material/locale";
import { faIR as pickersFaIR } from "@mui/x-date-pickers/locales";

const theme = createTheme(
  {
    direction: "rtl",
  },
  coreFaIR,
  pickersFaIR
);

export default theme;
