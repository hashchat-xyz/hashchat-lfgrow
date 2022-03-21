import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import Blockies from "react-blockies";
import { useWeb3React } from "@web3-react/core";

export default function Header() {
  const { active, account } = useWeb3React();

  return (
    <div>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={6}>
          <Typography variant="h4">Hashchat</Typography>
        </Grid>
        <Grid item xs={6} textAlign="right">
          {active && account ? (
            <div>
              <Button
                onClick={() => {
                  // disconnect();
                }}
                variant="contained"
                size="large"
              >
                {account}
              </Button>
              <Blockies seed={account} />
            </div>
          ) : (
            <Button
              onClick={() => {
                // connect();
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
