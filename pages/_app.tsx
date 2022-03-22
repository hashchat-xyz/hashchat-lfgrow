import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider: any, connector: any) {
  return new Web3Provider(provider);
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary} children={undefined}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default App;
