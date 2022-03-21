import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Blockies from "react-blockies";
import { SelfID } from "@self.id/web";

export default function ThreadList({ selfID }: { selfID: SelfID }) {
  return (
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
  );
}
