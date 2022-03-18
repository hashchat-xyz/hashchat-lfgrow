import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function Connect() {
  return (
    <div>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={6}>
          <Typography variant="h4">Haschat</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5} item xs={12} paddingTop={20}>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" size="large">
            Connect to Metamask
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" size="large">
            WalletConnect
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
