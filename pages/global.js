//importing theme components here
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

//creating the dark mode theme here
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

//creating the light mode theme here
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

// attempts to toggle between themes
export default function themeToggler() {
  theme === "light" ? setTheme("dark") : setTheme("light");
}
