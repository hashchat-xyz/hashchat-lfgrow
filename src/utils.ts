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
import { gql } from "@apollo/client/core";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

const httpLink = new HttpLink({
  uri: "https://api-mumbai.lens.dev",
  fetch,
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const GET_PROFILE = `
  query($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        handle
        ownedBy
      }
    }
  }
`;

export interface ProfilesRequest {
  profileIds?: string[];
  ownedBy?: string;
  handles?: string[];
  whoMirroredPublicationId?: string;
}

export const getProfileRequest = (request: ProfilesRequest) => {
  return apolloClient.query({
    query: gql(GET_PROFILE),
    variables: {
      request,
    },
  });
};

export const CHAIN = "mumbai";
const WORKER_ENDPOINT = "https://hashchat-worker.codynhat.workers.dev";

export function generateWalletAccessControlConditions(
  fromAddr: string,
  toAddr: string
) {
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
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: fromAddr,
      },
    },
  ];
}

export function generateLensAccessControlConditions(
  fromAddr: string,
  profileTokenId: string
) {
  return [
    {
      contractAddress: "0xd7B3481De00995046C7850bCe9a5196B7605c367",
      standardContractType: "ERC721",
      chain: CHAIN,
      method: "ownerOf",
      parameters: [parseInt(profileTokenId, 16).toString(10)],
      returnValueTest: {
        comparator: "=",
        value: ":userAddress",
      },
    },
    { operator: "or" },
    {
      contractAddress: "",
      standardContractType: "",
      chain: CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: fromAddr,
      },
    },
  ];
}

export async function getLabelForThread(
  account: string,
  accessControlConditions: any
) {
  if (!accessControlConditions) {
    return "BAD";
  }

  if (
    accessControlConditions[0].contractAddress ==
    "0xd7B3481De00995046C7850bCe9a5196B7605c367"
  ) {
    // Lens
    const tokenId = accessControlConditions[0].parameters[0];
    const profile = await getProfileRequest({
      profileIds: [`0x0${parseInt(tokenId).toString(16)}`],
    });
    return profile.data.profiles.items[0].ownedBy.toLowerCase() ==
      account.toLowerCase()
      ? accessControlConditions[2].returnValueTest.value.slice(0, 10)
      : profile.data.profiles.items[0].handle;
  } else if (accessControlConditions[0].method == "ownerOf") {
    return "BAD";
  } else {
    // Wallet
    return accessControlConditions[0].returnValueTest.value.toLowerCase() ==
      account.toLowerCase()
      ? accessControlConditions[2].returnValueTest.value.slice(0, 5) +
          "..." +
          accessControlConditions[2].returnValueTest.value.slice(-5)
      : accessControlConditions[0].returnValueTest.value.slice(0, 5) +
          "..." +
          accessControlConditions[0].returnValueTest.value.slice(-5);
  }
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
  const jwe = await encryptMsg({ text: msg, timestamp: Date.now() }, key);

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
