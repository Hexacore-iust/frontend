import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";

const CustomAccordion = (props) => {
  const { detailsChildren, summary, hasAction, actionChildren, color } = props;
  return (
    <Accordion sx={{ borderRadius: "16px" }}>
      {/* // <Accordion> */}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
        >
          <Box
            sx={{
              width: "16px",
              bgcolor: `${color}`,
              borderRadius: "0 8px 8px 0",
              position: "absolute",
              left: "0",
              height: "60%",
            }}
          />
          <Typography style={{ marginRight: "14px" }} component="span">
            {summary}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{detailsChildren}</AccordionDetails>
      {hasAction && <AccordionActions>{actionChildren}</AccordionActions>}
    </Accordion>
  );
};
export default CustomAccordion;
