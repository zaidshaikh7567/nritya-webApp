import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import ContactUsWidget from "../Components/ContactUsWidget";
import useOutOfView from "../hooks/useOutOfView";
import GetInTouch from "../Components/NrityaLandingPage/GetInTouch";
import OurServices from "../Components/NrityaLandingPage/OurServices";
import Community from "../Components/NrityaLandingPage/Community";
import LaunchOffer from "../Components/NrityaLandingPage/LaunchOffer";
import Banner from "../Components/NrityaLandingPage/Banner";
import useCurrentBreakpoint from "../hooks/useBreakpoint";

const getDesignTokens = () => ({
  typography: {
    fontFamily: ["Wittgenstein", "Roboto", "sans-serif"].join(","),
  },
});

const NrityaLandingPage = () => {
  const isDarkMode = useSelector(selectDarkModeStatus);

  const getInTouchSectionRef = useRef(null);
  const isOutOfView = useOutOfView(getInTouchSectionRef);
  const breakpoint = useCurrentBreakpoint();

  const theme = useMemo(
    () => createTheme(getDesignTokens(isDarkMode ? "dark" : "light")),
    [isDarkMode]
  );

  const scrollToGetInTouchSection = () => {
    getInTouchSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Banner scrollToGetInTouchSection={scrollToGetInTouchSection} />

      <LaunchOffer />

      <Community />

      <OurServices />

      <GetInTouch ref={getInTouchSectionRef} />

      {isOutOfView && !["xs", "sm"].includes(breakpoint) && <ContactUsWidget />}
    </ThemeProvider>
  );
};

export default NrityaLandingPage;
