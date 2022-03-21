import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 1337],
});

export default function Connect() {
  const { activate } = useWeb3React();
  const [activating, setActivating] = React.useState(false);

  async function connectInjected() {
    setActivating(true);
    try {
      await activate(injected);
    } catch (error) {
      console.log(error);
    }
    setActivating(false);
  }

  return (
    <div>
      <Grid container item xs={12} component={Paper} padding={5}>
        <Grid item xs={6}>
          <Typography variant="h4">Hashchat</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={5} item xs={12} paddingTop={20}>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            size="large"
            disabled={activating}
            onClick={connectInjected}
          >
            Connect to Metamask
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
