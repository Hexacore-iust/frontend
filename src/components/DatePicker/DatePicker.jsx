import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CustomDatePicker = (props) => {
  const { label, dateValue, handleChangeDate, fullWidth } = props;

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
        <DatePicker
          label={label}
          value={dateValue}
          onChange={handleChangeDate}
          slotProps={{
            textField: {
              fullWidth: fullWidth,
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
