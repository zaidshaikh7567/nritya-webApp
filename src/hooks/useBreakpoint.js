import { useMediaQuery, useTheme } from "@mui/material";

const useCurrentBreakpoint = () => {
  const theme = useTheme();

  const breakpoints = theme.breakpoints;

  const isXs = useMediaQuery(breakpoints.only("xs"));
  const isSm = useMediaQuery(breakpoints.only("sm"));
  const isMd = useMediaQuery(breakpoints.only("md"));
  const isLg = useMediaQuery(breakpoints.only("lg"));
  const isXl = useMediaQuery(breakpoints.only("xl"));

  if (isXs) return "xs";
  if (isSm) return "sm";
  if (isMd) return "md";
  if (isLg) return "lg";
  if (isXl) return "xl";

  return "xs";
};

export default useCurrentBreakpoint;
