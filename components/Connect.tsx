import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useConnection } from "@self.id/framework";

export default function Connect() {
  const [connection, connect, disconnect] = useConnection();

  return (
    <div>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={6}>
          <Typography variant="h4">Hashchat</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5} item xs={12} paddingTop={20}>
        <Grid item xs={12} textAlign="center">
          {connection.status === "connected" ? (
            <Button
              onClick={() => {
                disconnect();
              }}
              variant="contained"
              size="large"
            >
              Disconnect ({connection.selfID.id})
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
