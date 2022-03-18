import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";

export default function Header() {
  const [connection, connect, disconnect] = useConnection();
  const [authState, authenticate] = useMultiAuth();

  return (
    <div>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={6}>
          <Typography variant="h4">Hashchat</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          {connection.status === "connected" ? (
            <Button
              onClick={() => {
                disconnect();
              }}
              variant="contained"
              size="large"
            >
              {authState.status === "authenticated"
                ? authState.auth.accountID.address
                : null}
            </Button>
          ) : (
            <Button
              disabled={connection.status === "connecting"}
              onClick={() => {
                connect();
              }}
              variant="contained"
              size="large"
            >
              Connect
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
