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
  isCreating: boolean;
  onWalletAddress: (value: string) => void;
  onLensHandle: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onWalletAddress, onLensHandle, isCreating, open } = props;
  const [walletAddress, setWalletAddress] = React.useState("");
  const [lensHandle, setLensHandle] = React.useState("");

  const handleWalletAddress = () => {
    onWalletAddress(walletAddress);
  };

  const handleLensHandle = () => {
    onLensHandle(lensHandle);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Paste a wallet address or Lens handle below.</DialogTitle>
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

    await litNodeClient.connect();

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString("");

    const collection: Collection = (await AppendCollection.create(
      selfID.client.ceramic,
      {
        sliceMaxItems: 256,
      }
    )) as Collection;

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

    const hashOfKey = await sha256.digest(encryptedSymmetricKey);
    const strHashOfKey = base32.encode(hashOfKey.bytes).toString();

    const doc = await TileDocument.deterministic(selfID.client.ceramic, {
      controllers: [selfID.did.id],
      family: "hashchat:lit",
      tags: [`hashchat:lit:${strHashOfKey}`],
    });

    await doc.update({
      accessControlConditions: accessControlConditions,
      encryptedSymmetricKey: encodeb64(encryptedSymmetricKey),
      encryptedStreamId: encryptedStreamId,
    });
    const _streamId = doc.id.toString();

    await postToInbox(inboxAddress, _streamId);
    await postToOutbox(account!, `hashchat:lit:${strHashOfKey}`);

    console.log("Lit Stream: ", doc.id.toString());
    console.log("Collection: ", collection.id.toString());

    setCreating(false);
    setOpen(false);
    reload();
  };

  const createThreadForWallet = async (toAddr: string) => {
    setCreating(true);

    const accessControlConditions = generateWalletAccessControlConditions(
      account!,
      toAddr
    );

    await createThread(accessControlConditions, toAddr);
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
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Create Thread
      </Button>
      <SimpleDialog
        open={open}
        isCreating={isCreating}
        onWalletAddress={(value) => createThreadForWallet(value)}
        onLensHandle={(value) => createThreadForLens(value)}
      />
    </div>
  );
}
