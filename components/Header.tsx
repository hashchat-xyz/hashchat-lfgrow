import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import Blockies from "react-blockies";
import { useWeb3React } from "@web3-react/core";
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

export default function Header() {
  const { active, account } = useWeb3React();
  //set theme
  const [theme, setTheme] = useState("dark");

  // attempts to toggle between themes
  function themeToggler() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <div>
        <Grid container item xs={12} component={Paper} padding={5}>
          <Grid item xs={3}>
            <Typography variant="h4">Hashchat</Typography>
          </Grid>
          <Grid item xs={9} textAlign="right" spacing={2}>
            {active && account ? (
              <div>
                <Button variant="contained" size={"small"} color={"secondary"}>
                  Send Message
                </Button>
                <Button
                  onClick={() => {
                    // disconnect();
                  }}
                  variant="contained"
                  size="small"
                >
                  {account}
                </Button>
                <Button
                  variant={"contained"}
                  size={"small"}
                  onClick={() => themeToggler()}
                >
                  Change Theme
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  // connect();
                }}
                variant="contained"
                size="small"
              >
                Connect
              </Button>
            )}
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}
