import createCache from "@emotion/cache";
import rtlPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";

// Create rtl cache
const rtlCache = createCache({
  key: "rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default rtlCache;
