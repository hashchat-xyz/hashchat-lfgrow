import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { EthereumAuthProvider, SelfID } from "@self.id/web";

async function getLibrary(provider: any, connector: any) {
  const addresses = await provider.request({ method: "eth_requestAccounts" });

  return await SelfID.authenticate({
    authProvider: new EthereumAuthProvider(provider, addresses[0]),
    ceramic: "testnet-clay",
    connectNetwork: "testnet-clay",
  });
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default App;
