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
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

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

export function Header() {
  const { active, account } = useWeb3React();
  //set theme
  const [theme, setTheme] = useState("dark");

  // attempts to toggle between themes
  function themeToggler() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <Grid>
        <Grid container item xs={12} component={Paper} padding={5}>
          <Grid item xs={3}>
            <Typography variant="h4">Hashchat</Typography>
          </Grid>
          <Grid item xs={9} textAlign="right" spacing={2}>
            {active && account ? (
              <Grid>
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
                <Blockies seed={account} />
              </Grid>
            ) : (
              <Grid>
                <Button
                  onClick={() => {
                    // connect();
                  }}
                  variant="contained"
                  size="small"
                >
                  Connect
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default React.memo(Header);
