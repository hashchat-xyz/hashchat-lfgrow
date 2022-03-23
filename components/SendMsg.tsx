import { Button, CardBody } from "grommet";
import React, { useState, useEffect, JSXElementConstructor } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { setAccessControlConditions } from "../src/utils";
import { useConnection, useCore } from "@self.id/framework";
import { useMultiAuth } from "@self.id/multiauth";
import LitJsSdk from "lit-js-sdk";
import {
  generateLitAuthSig,
  encryptAndAddMessageToCollection,
  encryptMsg,
  postToInbox,
  getInbox,
  encodeb64,
  decodeb64,
  decryptMsg,
} from "../src/utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import {
  AppendCollection,
  Collection,
} from "@cbj/ceramic-append-collection";
import { useWeb3React } from "@web3-react/core";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useSelfID } from "../src/hooks";

const CHAIN = "polygon";

// const CeramicClient = require('@ceramicnetwork/http-client').default
// const ceramic = new CeramicClient()

export default function SendMsg() {
  const { account } = useWeb3React();
  const [messages, setMessages] = useState([] as any[]);
  const [toAddr, setAddr] = useState("");
  const [msg, setMsg] = useState("");
  const [streamId, setStreamId] = useState("");
  const { selfID, web3Provider } = useSelfID();

  const msgwrite = async () => {
    const litNodeClient = new LitJsSdk.LitNodeClient();

    await litNodeClient.connect();

    const collection: Collection = (await AppendCollection.create(
      selfID.client.ceramic,
      {
        sliceMaxItems: 256,
      }
    )) as Collection;

    const accessControlConditions = setAccessControlConditions(toAddr);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("");
    // Encrypt collection stream ID using dag-jose
    const encryptedStreamId = await encryptMsg(
      { threadStreamId: collection.id.toString() },
      symmetricKey
    );
    let authSig = await generateLitAuthSig(web3Provider.provider);

    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
    });

    await encryptAndAddMessageToCollection(collection, msg, symmetricKey);

    const doc = await TileDocument.create(selfID.client.ceramic, {
      accessControlConditions: accessControlConditions,
      encryptedSymmetricKey: encodeb64(encryptedSymmetricKey),
      encryptedStreamId: encryptedStreamId,
    });
    const _streamId = doc.id.toString();

    await postToInbox(toAddr, _streamId);

    setStreamId(_streamId);
    console.log("setting streamId ", _streamId);
    console.log("Collection: ", collection.id.toString());
  };

  return (
    <>
      <TextField
        autoFocus
        disabled={false}
        fullWidth
        id="toAddr"
        label="toAddr"
        onChange={(event: { target: { value: any } }) =>
          setAddr(event.target.value)
        }
        placeholder="Address"
        type="text"
        value={toAddr}
        variant="standard"
      />
      <TextField
        autoFocus
        disabled={false}
        fullWidth
        id="msg"
        label="msg"
        onChange={(event: {
          target: { value: React.SetStateAction<string> };
        }) => setMsg(event.target.value)}
        placeholder="Enter your message here"
        type="text"
        value={msg}
        variant="standard"
      />
      <Button color="primary" onClick={() => msgwrite()}>
        ENCRYPT AND SEND
      </Button>
    </>
  );
}
