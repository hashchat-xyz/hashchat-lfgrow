import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { EthereumAuthProvider, SelfID } from "@self.id/web";
import { Web3Provider } from "@ethersproject/providers";

export function useSelfID() {
  const { library } = useWeb3React();
  const [selfID, setSelfID] = useState({} as SelfID);
  const [ethProvider, setEthProvider] = useState({} as EthereumAuthProvider);

  useEffect(() => {
    if (library && !selfID.id) {
      const build = async () => {
        const web3Provider = library as Web3Provider;
        const addresses = await web3Provider.listAccounts();

        const _provider = await new EthereumAuthProvider(
          web3Provider.provider,
          addresses[0]
        );
        setEthProvider(_provider);

        const _selfID = await SelfID.authenticate({
          authProvider: _provider,
          ceramic: "testnet-clay",
          connectNetwork: "testnet-clay",
        });
        setSelfID(_selfID);
      };

      build();
    }
  }, [library]);

  return {
    selfID: selfID,
    web3Provider: library as Web3Provider,
    ethProvider: ethProvider,
  };
}
