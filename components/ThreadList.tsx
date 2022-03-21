import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Blockies from "react-blockies";
import { SelfID } from "@self.id/web";
import { useSelfID } from "../src/hooks";
import { useEffect, useState } from "react";
import {
  decodeb64,
  decryptMsg,
  generateLitAuthSig,
  getInbox,
} from "../src/utils";
import LitJsSdk from "lit-js-sdk";
import { useWeb3React } from "@web3-react/core";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { TileLoader } from "@glazed/tile-loader";

const CHAIN = "polygon";

export default function ThreadList({
  selectedThread,
  setSelectedThread,
}: {
  selectedThread: any;
  setSelectedThread: any;
}) {
  const { account } = useWeb3React();
  const { selfID, ethProvider, web3Provider } = useSelfID();
  const [inbox, setInbox] = useState([] as any[]);

  useEffect(() => {
    const readInbox = async () => {
      if (selfID != null && selfID.client != null && account) {
        const litNodeClient = new LitJsSdk.LitNodeClient();

        const authSig = await generateLitAuthSig(web3Provider.provider);
        await litNodeClient.connect();

        const _inbox = await getInbox(account);

        const loader = new TileLoader({ ceramic: selfID.client.ceramic });

        const _inboxWithMsgs = (
          await Promise.all(
            _inbox.map((streamId) => {
              return loader.load(streamId);
            })
          )
        ).map((stream) => {
          return {
            threadId: stream.id,
            from: stream.controllers[0],
          };
        });
        setInbox(_inboxWithMsgs);
      }
    };

    readInbox();
  }, [selfID]);

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
        {inbox.map((thread, i) => (
          <ListItemButton
            selected={selectedThread === thread.threadId}
            key={i}
            onClick={() => {
              setSelectedThread(thread.threadId);
            }}
          >
            <ListItemIcon>
              <Blockies seed={thread.from} />
            </ListItemIcon>
            <ListItemText primary={thread.threadId.toString().slice(0, 10)}>
              {thread.from}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Grid>
  );
}
