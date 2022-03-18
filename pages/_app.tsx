import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@self.id/framework";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider client={{ ceramic: "testnet-clay" }}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
