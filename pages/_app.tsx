import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo, useState } from "react";
import { PaletteMode } from "@mui/material";
import { ColorModeContext } from "next-color-mode";
import { EthereumAuthProvider, SelfID, WebClient } from "@self.id/web";

function getLibrary(provider: any, connector: any) {
  const library = new Web3Provider(provider);

  const build = async () => {
    const web3Provider = library as Web3Provider;
    const addresses = await web3Provider.listAccounts();

    const _provider = await new EthereumAuthProvider(
      web3Provider.provider,
      addresses[0]
    );

    const webClient = new WebClient({
      ceramic: "testnet-clay",
    });
    await webClient.authenticate(_provider);

    const _selfID = new SelfID({
      client: webClient,
    });

    return {
      selfID: _selfID,
      web3Provider: library as Web3Provider,
    };
  };

  return build();
}

function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
