import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
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
import { useConnection } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import Header from "../components/Header";
import Blockies from "react-blockies";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

export default function Chat() {
  const { active } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    if (!active) {
      router.push("/");
    }
  }, [active]);

  return (
    <div>
      <Header />
      <Grid container padding={3}>
        <Grid item xs={3}>
          <Grid item xs={12} style={{ padding: "10px" }}>
            {/*Search Field needs to query list of contacts and populate the correct contact at the top*/}
            <TextField
              id="outlined-basic-email"
              label="Search My Contacts"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            {/*List Item needs to populate the correct pulic address.*/}
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Blockies seed="0x862efbff8e2a634dbda85b461f4d1c41a557c46b" />
              </ListItemIcon>
              <ListItemText primary="Ryan.eth">Ryan.eth</ListItemText>
            </ListItem>
            {/*List Item needs to populate the correct pulic address.*/}
            <ListItem button key="Alice">
              <ListItemIcon>
                <Blockies seed="0xcd2e72aebe2a203b84f46deec948e6465db51c75" />
              </ListItemIcon>
              <ListItemText primary="Alice.eth">Alice.eth</ListItemText>
            </ListItem>
            {/*List Item needs to populate the correct pulic address.*/}
            <ListItem button key="CindyBaker">
              <ListItemIcon>
                <Blockies seed="0xB3E625228bE2D986Af0076aB8F75bA3318db26d1" />
              </ListItemIcon>
              <ListItemText primary="Cindy.eth">Cindy.eth</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={9}>
          <List>
            {/*List Item needs to populate message streams and update the time the message was recieved/sent.*/}
            <ListItem key="1">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    primary="Hey man, What's up ?"
                  ></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    secondary="09:30"
                  ></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
            {/*List Item needs to populate message streams and update the time the message was recieved/sent.*/}
            <ListItem key="2">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    primary="Hey, Iam Good! What about you ?"
                  ></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-start" }}
                    secondary="09:31"
                  ></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
            {/*List Item needs to populate message streams and update the time the message was recieved/sent.*/}
            <ListItem key="3">
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    primary="Cool. i am good, let's catch up!"
                  ></ListItemText>
                </Grid>
                <Grid item xs={12}>
                  <ListItemText
                    style={{ display: "flex", justifyContent: "flex-end" }}
                    secondary="10:30"
                  ></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
              />
            </Grid>
            <Grid
              xs={1}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Fab color="primary" aria-label="add">
                {/*Send Icon needs to be functional.*/}
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
