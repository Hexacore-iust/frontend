import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CustomDatePicker = (props) => {
  const { label, dateValue, setDateValue } = props;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={dateValue}
          onChange={(newValue) => setDateValue(newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: "normal",
              size: "small",
              sx: {
                input: {
                  color: "#777",
                },
                "& .MuiInputBase-root": {
                  flexDirection: "row-reverse",
                },
                "& .MuiInputAdornment-root": {
                  marginRight: 0,
                  marginLeft: 0,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </>
  );
};
export default CustomDatePicker;
