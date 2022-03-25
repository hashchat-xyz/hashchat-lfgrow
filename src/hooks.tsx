import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { EthereumAuthProvider, SelfID, WebClient } from "@self.id/web";
import { Web3Provider } from "@ethersproject/providers";

export function useSelfID() {
  const { library, active } = useWeb3React();
  const [selfID, setSelfID] = useState({} as SelfID);
  const [web3Provider, setWeb3Provider] = useState({} as Web3Provider);

  useEffect(() => {
    if (active && library && !selfID.id) {
      const build = async () => {
        const libraryP = await library;
        setWeb3Provider(libraryP.web3Provider);
        setSelfID(libraryP.selfID);
      };

      build();
    }
  }, [active]);

  return {
    selfID,
    web3Provider,
  };
}
