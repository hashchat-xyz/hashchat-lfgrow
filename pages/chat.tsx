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
import Header from "../components/Header";
import ThreadList from "../components/ThreadList";
import Blockies from "react-blockies";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useSelfID } from "../src/hooks";

export default function Chat() {
  const { active } = useWeb3React();
  const router = useRouter();
  const { selfID } = useSelfID();

  console.log(selfID);

  useEffect(() => {
    if (!active) {
      router.push("/");
    }
  }, [active]);

  return (
    <div>
      <Header />
      {selfID.id ? (
        <Grid container padding={3}>
          <ThreadList></ThreadList>
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
      ) : null}
    </div>
  );
}
