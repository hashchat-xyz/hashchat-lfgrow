//togle stuff
import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
//importing theme components here
import { createTheme, ThemeProvider } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import Header from "../components/Header";
import ThreadList from "../components/ThreadList";
import MessageList from "../components/MessageList";
import Blockies from "react-blockies";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useSelfID } from "../src/hooks";
import CssBaseline from "@mui/material/CssBaseline";

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

export default function Chat() {
  const { active } = useWeb3React();
  const router = useRouter();
  const { selfID } = useSelfID();
  const [selectedThread, setSelectedThread] = useState("");
  const [theme, setTheme] = useState("dark");

  // attempts to toggle between themes
  function themeToggler() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  useEffect(() => {
    if (!active) {
      router.push("/");
    }
  }, [active]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <>
        <Header />
        {selfID.id ? (
          <Grid container padding={3}>
            <ThreadList
              selectedThread={selectedThread}
              setSelectedThread={setSelectedThread}
            ></ThreadList>
            <MessageList threadId={selectedThread}></MessageList>
          </Grid>
        ) : null}
      </>
    </ThemeProvider>
  );
}
