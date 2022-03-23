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
import {
  AppendCollection,
  Collection,
} from "@cbj/ceramic-append-collection/dist/index.js";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import SendMsg from '../components/SendMsg';

const CHAIN = "polygon";

export function MessageList({ threadId }: { threadId: string }) {
  const { account } = useWeb3React();
  const { selfID, ethProvider, web3Provider } = useSelfID();
  const [messages, setMessages] = useState([] as any[]);

  useEffect(() => {
    setMessages([]);

    const readThread = async () => {
      if (threadId) {
        const litNodeClient = new LitJsSdk.LitNodeClient();

        const authSig = await generateLitAuthSig(web3Provider.provider);
        await litNodeClient.connect();

        const litStream = await TileDocument.load(
          selfID.client.ceramic,
          threadId
        );
        const litStreamContent = litStream.content as any;

        const symmetricKey: Uint8Array = await litNodeClient.getEncryptionKey({
          accessControlConditions: litStreamContent.accessControlConditions,
          toDecrypt: LitJsSdk.uint8arrayToString(
            decodeb64(litStreamContent.encryptedSymmetricKey),
            "base16"
          ),
          chain: CHAIN,
          authSig,
        });

        const streamIdContainer = await decryptMsg(
          litStreamContent.encryptedStreamId,
          symmetricKey
        );

        const collection = await AppendCollection.load(
          selfID.client.ceramic,
          streamIdContainer.threadStreamId
        );

        const encryptedMsgs = await collection.getFirstN(5);

        const cleartextMsgs = await Promise.all(
          encryptedMsgs.map(async (item: any) => {
            return await decryptMsg(item.value, symmetricKey);
          })
        );

        setMessages(cleartextMsgs);
      }
    };

    readThread();
  }, [threadId]);

  return (
    <Grid item xs={9}>
      <List>
        {messages.map((message, i) => (
          <ListItem key={i}>
            <Grid container>
              <Grid item xs={12}>
                <ListItemText
                  style={{ display: "flex", justifyContent: "flex-end" }}
                  primary={message.text}
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
        ))}
      </List>
      <Divider />
      <Grid container style={{ padding: "20px" }}>
        {/* <Grid item xs={11}>
          <TextField
            id="outlined-basic-email"
            label="Type Something"
            fullWidth
          />
        </Grid> */}
        <SendMsg />
        {/* <Grid item xs={1} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Fab color="primary" aria-label="add">
            <SendIcon /> */}
      </Grid>
    </Grid>
  );
}

export default React.memo(MessageList);