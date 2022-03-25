import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import Blockies from "react-blockies";
import { useWeb3React } from "@web3-react/core";
import { useColorMode } from "next-color-mode";

export function Header({ reload }: { reload: any }) {
  const { active, account } = useWeb3React();
  const { toggleColorMode } = useColorMode();

  return (
    <Grid>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={3}>
          <Typography variant="h4">Hashchat</Typography>
        </Grid>
        <Grid item xs={9} textAlign="right" container spacing={2}>
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
                onClick={() => toggleColorMode()}
              >
                Change Theme
              </Button>
              <Button
                variant={"contained"}
                size={"small"}
                onClick={() => reload()}
              >
                Reload
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
  );
}

export default React.memo(Header);
