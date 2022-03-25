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
  getOutbox,
} from "../src/utils";
import LitJsSdk from "lit-js-sdk";
import { useWeb3React } from "@web3-react/core";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { TileLoader } from "@glazed/tile-loader";
import { Thread } from "../pages/chat";

export function ThreadList({
  selectedThread,
  setSelectedThread,
  reloadTrigger,
}: {
  selectedThread: any;
  setSelectedThread: any;
  reloadTrigger: any;
}) {
  const { account } = useWeb3React();
  const { selfID, web3Provider } = useSelfID();
  const [inbox, setInbox] = useState([] as Thread[]);

  useEffect(() => {
    setInbox([]);

    const readInbox = async () => {
      if (selfID != null && selfID.client != null && account) {
        const litNodeClient = new LitJsSdk.LitNodeClient();

        await generateLitAuthSig(web3Provider.provider);
        await litNodeClient.connect();

        const _inbox = await getInbox(account);
        const _outbox = await getOutbox(account);

        const loader = new TileLoader({ ceramic: selfID.client.ceramic });

        const _outboxWithMsgs = (
          await Promise.all(
            _outbox.map(async (threadId) => {
              const outbox = await TileDocument.deterministic(
                selfID.client.ceramic,
                {
                  controllers: [selfID.did.id],
                  family: "hashchat:lit",
                  tags: [threadId],
                }
              );

              return loader.load(outbox.id);
            })
          )
        )
          .map((stream) => {
            return {
              threadId: stream.metadata.tags![0],
              inbox: [],
              outbox: stream.id,
            };
          })
          .reduce(
            (
              prev: Record<string, Thread>,
              thread: Thread
            ): Record<string, Thread> => {
              let record = prev[thread.threadId];
              if (!record) {
                prev[thread.threadId] = thread;
              }
              return prev;
            },
            {} as Record<string, Thread>
          );

        const _inboxWithMsgs = Object.values(
          await (
            await Promise.all(
              _inbox.map((streamId) => {
                return loader.load(streamId);
              })
            )
          )
            .filter((stream) => {
              return (
                stream.metadata.family === "hashchat:lit" &&
                stream.metadata.tags &&
                stream.metadata.tags.length > 0
              );
            })
            .reduce(
              async (
                prevP: Promise<Record<string, Thread>>,
                stream: TileDocument<Record<string, any>>
              ): Promise<Record<string, Thread>> => {
                const prev = await prevP;
                const threadId = stream.metadata.tags![0];
                let record = prev[threadId];
                if (record) {
                  record.threadId = threadId;
                  if (!record.inbox.includes(stream.id)) {
                    record.inbox.push(stream.id);
                  }
                  prev[threadId] = record;
                } else {
                  const outbox = await TileDocument.deterministic(
                    selfID.client.ceramic,
                    {
                      controllers: [selfID.did.id],
                      family: "hashchat:lit",
                      tags: [threadId],
                    }
                  );

                  prev[threadId] = {
                    threadId: threadId,
                    inbox: [stream.id],
                    outbox: outbox.id,
                  };
                }
                return prev;
              },
              Promise.resolve(_outboxWithMsgs)
            )
        );

        setInbox(_inboxWithMsgs);
      }
    };

    readInbox();
  }, [selfID, reloadTrigger]);

  return (
    <Grid item xs={3}>
      {/* <Grid item xs={12} style={{ padding: "10px" }}>
        <TextField
          id="outlined-basic-email"
          label="Search My Contacts"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Divider /> */}
      <List>
        {inbox
          .map((thread, i) => (
            <ListItemButton
              selected={selectedThread.threadId === thread.threadId}
              key={i}
              onClick={() => {
                setSelectedThread(thread);
              }}
            >
              <ListItemIcon>
                <Blockies seed={thread.threadId} />
              </ListItemIcon>
              <ListItemText primary={thread.threadId.toString().slice(-10)}>
                {thread.threadId}
              </ListItemText>
            </ListItemButton>
          ))
          .reverse()}
      </List>
    </Grid>
  );
}

export default React.memo(ThreadList);
