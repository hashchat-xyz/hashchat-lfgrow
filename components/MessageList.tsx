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
  CHAIN,
  encryptAndAddMessageToCollection,
  postToOutbox,
  encryptMsg,
  encodeb64,
  postToInbox,
} from "../src/utils";
import LitJsSdk from "lit-js-sdk";
import { useWeb3React } from "@web3-react/core";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { AppendCollection, Collection } from "@cbj/ceramic-append-collection";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import { Thread } from "../pages/chat";

interface Message {
  from: string;
  message: Record<string, any>;
}

interface Outbox {
  collection: Collection;
  key: Uint8Array;
}

export function MessageList({
  thread,
  setSelectedThread,
}: {
  thread: Thread;
  setSelectedThread: any;
}) {
  const { account } = useWeb3React();
  const { selfID, web3Provider } = useSelfID();
  const [messages, setMessages] = useState([] as Message[]);
  const [showSendBox, setShowSendBox] = useState(false);
  const [isSending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [outbox, setOutbox] = useState({} as Outbox);

  const isReady = thread.threadId && selfID.client;

  useEffect(() => {
    setShowSendBox(false);
    setMessages([]);

    const readThread = async () => {
      if (isReady) {
        const litNodeClient = new LitJsSdk.LitNodeClient();

        const authSig = await generateLitAuthSig(web3Provider.provider);
        await litNodeClient.connect();

        const outboxLitStream = await TileDocument.load(
          selfID.client.ceramic,
          thread.outbox
        );

        if (outboxLitStream.allCommitIds.length == 1) {
          // Create outbox
          console.log("Creating outbox...");

          // Load existing inbox
          const inboxLitStream = await TileDocument.load(
            selfID.client.ceramic,
            thread.inbox[0]
          );
          const litStreamContent = inboxLitStream.content as any;

          const collection: Collection = (await AppendCollection.create(
            selfID.client.ceramic,
            {
              sliceMaxItems: 256,
            }
          )) as Collection;

          const symmetricKey: Uint8Array = await litNodeClient.getEncryptionKey(
            {
              accessControlConditions: litStreamContent.accessControlConditions,
              toDecrypt: LitJsSdk.uint8arrayToString(
                decodeb64(litStreamContent.encryptedSymmetricKey),
                "base16"
              ),
              chain: CHAIN,
              authSig,
            }
          );

          const encryptedStreamId = await encryptMsg(
            { threadStreamId: collection.id.toString() },
            symmetricKey
          );

          await outboxLitStream.update({
            accessControlConditions: litStreamContent.accessControlConditions,
            encryptedSymmetricKey: litStreamContent.encryptedSymmetricKey,
            encryptedStreamId: encryptedStreamId,
          });

          console.log("Outbox created at " + outboxLitStream.id.toString());

          // Post to outboxes
          await Promise.all(
            litStreamContent.accessControlConditions.map(async (cond: any) => {
              if (
                cond.returnValueTest &&
                cond.returnValueTest.value.toLowerCase() !=
                  account?.toLowerCase()
              ) {
                await postToInbox(
                  cond.returnValueTest.value,
                  outboxLitStream.id.toString()
                );
              }
            })
          );
        }

        let allBoxes = [...thread.inbox, thread.outbox];

        const cleartextMsgs = (
          await Promise.all(
            allBoxes.map(async (inboxId): Promise<Message[]> => {
              const litStream = await TileDocument.load(
                selfID.client.ceramic,
                inboxId
              );

              const litStreamContent = litStream.content as any;

              const symmetricKey: Uint8Array =
                await litNodeClient.getEncryptionKey({
                  accessControlConditions:
                    litStreamContent.accessControlConditions,
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

              if (litStream.controllers[0] === selfID.did.id) {
                setOutbox({
                  collection: collection as Collection,
                  key: symmetricKey,
                });
              }

              const encryptedMsgs = await collection.getFirstN(5);

              return await Promise.all(
                encryptedMsgs.map(async (item: any): Promise<Message> => {
                  return {
                    from: litStream.controllers[0],
                    message: await decryptMsg(item.value, symmetricKey),
                  };
                })
              );
            })
          )
        ).flat();

        cleartextMsgs.sort((a, b) => {
          return a.message.timestamp - b.message.timestamp;
        });

        setMessages(cleartextMsgs);
        setShowSendBox(true);
      }
    };

    readThread();
  }, [thread, selfID]);

  const sendMessage = async () => {
    setSending(true);

    if (isReady) {
      await encryptAndAddMessageToCollection(
        outbox.collection,
        newMessage,
        outbox.key
      );

      await postToOutbox(account!, thread.threadId);

      let oldThread = thread;
      setSelectedThread({} as Thread);
      setSelectedThread(oldThread);
    }
  };

  return (
    <Grid item xs={9}>
      <List>
        {messages.map((message, i) => (
          <ListItem key={i}>
            <Grid container>
              <Grid item xs={12}>
                <ListItemText
                  style={{
                    display: "flex",
                    justifyContent:
                      message.from === selfID.did.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                  primary={message.message.text}
                ></ListItemText>
              </Grid>
              <Grid item xs={12}>
                <ListItemText
                  style={{
                    display: "flex",
                    justifyContent:
                      message.from === selfID.did.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                  secondary={new Date(message.message.timestamp).toTimeString()}
                ></ListItemText>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
      <Divider />
      {showSendBox ? (
        <Grid container style={{ padding: "20px" }}>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              disabled={isSending || !isReady}
              onChange={(event) => {
                setNewMessage(event.target.value);
              }}
            />
          </Grid>
          <Grid xs={1} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Fab
              color="primary"
              aria-label="add"
              disabled={isSending || !isReady || newMessage.length == 0}
              onClick={() => sendMessage()}
            >
              {/*Send Icon needs to be functional.*/}
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default React.memo(MessageList);
