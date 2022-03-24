import LitJsSdk from "lit-js-sdk";
import { ethers } from "ethers";
import { AppendCollection, Collection } from "@cbj/ceramic-append-collection";
import {
  xc20pDirEncrypter,
  xc20pDirDecrypter,
  createJWE,
  decryptJWE,
  JWE,
} from "did-jwt";
import { prepareCleartext, decodeCleartext } from "dag-jose-utils";
import axios from "axios";

export const CHAIN = "polygon";
const WORKER_ENDPOINT = "https://hashchat-worker.codynhat.workers.dev";

export function setAccessControlConditions(toAddr: string) {
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: toAddr,
      },
    },
  ];
}

export async function generateLitAuthSig(ethProvider: any): Promise<any> {
  const addresses = await ethProvider.request({
    method: "eth_requestAccounts",
  });
  const provider = new ethers.providers.Web3Provider(ethProvider);

  let authSig = localStorage.getItem("lit-auth-signature");
  if (!authSig) {
    console.log("signing auth message because sig is not in local storage");
    await LitJsSdk.signAndSaveAuthMessage({
      web3: provider,
      account: addresses[0],
    });
    authSig = localStorage.getItem("lit-auth-signature");
  }

  return JSON.parse(authSig || "{}");
}

export async function encryptMsg(
  msg: Record<string, any>,
  key: Uint8Array
): Promise<JWE> {
  const dirEncrypter = xc20pDirEncrypter(key);
  const cleartext = await prepareCleartext(msg);
  const jwe = await createJWE(cleartext, [dirEncrypter]);
  return jwe;
}

export async function encryptAndAddMessageToCollection(
  collection: Collection,
  msg: string,
  key: Uint8Array
): Promise<Collection> {
  const jwe = await encryptMsg({ text: msg }, key);

  await collection.insert(jwe);

  return collection;
}

export async function decryptMsg(
  msg: JWE,
  key: Uint8Array
): Promise<Record<string, any>> {
  const dirDecrypter = xc20pDirDecrypter(key);
  const decryptedData = await decryptJWE(msg, dirDecrypter);
  return decodeCleartext(decryptedData);
}

export async function postToInbox(user: string, streamId: string) {
  await axios.post(
    `${WORKER_ENDPOINT}/inbox/${user.toLowerCase()}/${streamId.toLowerCase()}`
  );
}

export async function getInbox(user: string): Promise<string[]> {
  const result = await axios.get(
    `${WORKER_ENDPOINT}/inbox/${user.toLowerCase()}`
  );
  return result.data["inbox"];
}

export async function postToOutbox(user: string, threadId: string) {
  await axios.post(
    `${WORKER_ENDPOINT}/outbox/${user.toLowerCase()}/${threadId.toLowerCase()}`
  );
}

export async function getOutbox(user: string): Promise<string[]> {
  const result = await axios.get(
    `${WORKER_ENDPOINT}/outbox/${user.toLowerCase()}`
  );
  return result.data["outbox"];
}

export function encodeb64(uintarray: any) {
  const b64 = Buffer.from(uintarray).toString("base64");
  return b64;
}

export function decodeb64(b64String: any) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}
