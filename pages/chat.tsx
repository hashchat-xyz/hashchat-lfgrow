//togle stuff
import * as React from "react";
import Grid from "@mui/material/Grid";
import Header from "../components/Header";
import ThreadList from "../components/ThreadList";
import MessageList from "../components/MessageList";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useSelfID } from "../src/hooks";
import CssBaseline from "@mui/material/CssBaseline";
import Overlay from "../components/Overlay";
import { StreamID } from '@ceramicnetwork/streamid';

export interface Thread {
  threadId: string;
  inbox: StreamID[];
  outbox: StreamID;
}

export function Chat() {
  const { active } = useWeb3React();
  const router = useRouter();
  const { selfID } = useSelfID();
  const [selectedThread, setSelectedThread] = useState({} as Thread);

  useEffect(() => {
    if (!active) {
      router.push("/");
    }
  }, [active]);

  return (
    <>
      <CssBaseline />
      <Header />
      <Grid item xs={12} paddingLeft={5}>
        <Overlay />
      </Grid>
      {selfID.id ? (
        <Grid container padding={3}>
          <ThreadList
            selectedThread={selectedThread}
            setSelectedThread={setSelectedThread}
          ></ThreadList>
          <MessageList thread={selectedThread}></MessageList>
        </Grid>
      ) : null}
    </>
  );
}

export default React.memo(Chat);
