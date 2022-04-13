import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LitJsSdk from "lit-js-sdk";
import {
  generateLitAuthSig,
  encryptAndAddMessageToCollection,
  encryptMsg,
  postToInbox,
  encodeb64,
  CHAIN,
  postToOutbox,
  generateWalletAccessControlConditions,
  generateLensAccessControlConditions,
  generateSolAccessControlConditions,
  getProfileRequest,
} from "../src/utils";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { AppendCollection, Collection } from "@cbj/ceramic-append-collection";
import { useSelfID } from "../src/hooks";
import { sha256 } from "multiformats/hashes/sha2";
import { base32 } from "multiformats/bases/base32";
import { useWeb3React } from "@web3-react/core";

export interface SimpleDialogProps {
  open: boolean;
  setOpen: any;
  isCreating: boolean;
  onWalletAddress: (value: string) => void;
  onsolAddress: (value: string) => void;
  onLensHandle: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onWalletAddress, onLensHandle, onsolAddress, setOpen, isCreating, open } = props;
  const [walletAddress, setWalletAddress] = React.useState("");
  const [lensHandle, setLensHandle] = React.useState("");
  const [solAddress, setsolAddress] = React.useState("");

  const handleWalletAddress = () => {
    onWalletAddress(walletAddress);
  };

  const handleLensHandle = () => {
    onLensHandle(lensHandle);
  };
  const handlesolAddress = () => {
    onsolAddress(solAddress);
  };
  return (
    <Dialog open={open}>
      <DialogTitle>
        To start a new Message Thread, Paste the 'to' wallet address or Lens
        handle below. (e.g. 0xd8da6bf26964af9d7eed9e03e53415d37aa96045 or
        hashchatlensdemo
      </DialogTitle>
      <Grid container style={{ padding: "20px" }} alignItems={"center"}>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            label="Wallet Address"
            variant="outlined"
            onChange={(event) => {
              setWalletAddress(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant="contained"
            onClick={handleWalletAddress}
            disabled={isCreating}
          >
            Enter
          </Button>
        </Grid>
      </Grid>
      <Grid container style={{ padding: "20px" }} alignItems={"center"}>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            label="Lens Handle"
            variant="outlined"
            onChange={(event) => {
              setLensHandle(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant="contained"
            onClick={handleLensHandle}
            disabled={isCreating}
          >
            Enter
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ padding: "20px" }} alignItems={"center"}>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            label="Sol Address"
            variant="outlined"
            onChange={(event) => {
              setsolAddress(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            size="small"
            variant="contained"
            onClick={handlesolAddress}
            disabled={isCreating}
          >
            Enter
          </Button>
        </Grid>
      </Grid>

      <Grid container style={{ padding: "20px" }} alignItems={"center"}>
        <Grid item xs={12}>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              setOpen(false);
            }}
            disabled={isCreating}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default function Overlay({ reload }: { reload: any }) {
  const [open, setOpen] = React.useState(false);
  const [isCreating, setCreating] = React.useState(false);
  const { selfID, web3Provider } = useSelfID();
  const { account } = useWeb3React();

  const createThread = async (
    accessControlConditions: any,
    inboxAddress: string
  ) => {
    const litNodeClient = new LitJsSdk.LitNodeClient();
    console.time('createThread 1');
    await litNodeClient.connect();
    console.timeEnd('createThread 1');

    console.time('createThread 2');

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("");
    console.timeEnd('createThread 2');
    console.time('createThread 3');

    const collection: Collection = (await AppendCollection.create(
      selfID.client.ceramic,
      {
        sliceMaxItems: 256,
      }
    )) as Collection;
    console.timeEnd('createThread 3');
    console.time('createThread 4');

    // Encrypt collection stream ID using dag-jose
    const encryptedStreamId = await encryptMsg(
      { threadStreamId: collection.id.toString() },
      symmetricKey
    );
    let authSig = await generateLitAuthSig(web3Provider.provider);
    console.timeEnd('createThread 4');
    console.time('createThread 5');

    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: CHAIN,
    });
    console.timeEnd('createThread 5');
    console.time('createThread 6');

    const hashOfKey = await sha256.digest(encryptedSymmetricKey);
    console.timeEnd('createThread 6');
    console.time('createThread 7');
    const strHashOfKey = base32.encode(hashOfKey.bytes).toString();
    console.timeEnd('createThread 7');
    console.time('createThread 8');

    const doc = await TileDocument.deterministic(selfID.client.ceramic, {
      controllers: [selfID.did.id],
      family: "hashchat:lit",
      tags: [`hashchat:lit:${strHashOfKey}`],
    });
    console.timeEnd('createThread 8');
    console.time('createThread 9');

    await doc.update({
      accessControlConditions: accessControlConditions,
      encryptedSymmetricKey: encodeb64(encryptedSymmetricKey),
      encryptedStreamId: encryptedStreamId,
    });
    const _streamId = doc.id.toString();
    console.timeEnd('createThread 9');
    console.time('createThread 10');

    await postToInbox(inboxAddress, _streamId);
    await postToOutbox(account!, `hashchat:lit:${strHashOfKey}`);
    console.timeEnd('createThread 10');
    console.time('createThread 11');

    console.log("Lit Stream: ", doc.id.toString());
    console.log("Collection: ", collection.id.toString());

    setCreating(false);
    setOpen(false);
    reload();
    console.timeEnd('createThread 11');
  };

  const createThreadForWallet = async (toAddr: string) => {
    setCreating(true);

    const accessControlConditions = generateWalletAccessControlConditions(
      account!,
      toAddr
    );

    await createThread(accessControlConditions, toAddr);
  };

  const createThreadForSol = async (solAddress: string) => {
    setCreating(true);

    const unifiedAccessControlConditions = generateSolAccessControlConditions(
      account!,
      solAddress
    );

    await createThread(unifiedAccessControlConditions, solAddress);
  };

  const createThreadForLens = async (lensHandle: string) => {
    setCreating(true);

    const profilesFromProfileIds = await getProfileRequest({
      handles: [lensHandle],
    });

    if (profilesFromProfileIds.data.profiles.length == 0) {
      setCreating(false);
      return;
    }

    const profileId = profilesFromProfileIds.data.profiles.items[0].id;

    const accessControlConditions = generateLensAccessControlConditions(
      account!,
      profileId
    );

    await createThread(
      accessControlConditions,
      profilesFromProfileIds.data.profiles.items[0].ownedBy
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <br />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        style={{ textTransform: "none" }}
      >
        Send New Message
      </Button>
      <SimpleDialog
        open={open}
        setOpen={setOpen}
        isCreating={isCreating}
        onWalletAddress={(value) => createThreadForWallet(value)}
        onLensHandle={(value) => createThreadForLens(value)}
        onsolAddress={(value) => createThreadForSol(value)}
      />
    </div>
  );
}
