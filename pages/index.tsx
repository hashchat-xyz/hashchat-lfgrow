import type { NextPage } from "next";
import Connect from "./connect";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const Home: NextPage = () => {
  const { active, library } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    const start = async () => {
      if (active && library) {
        const web3Provider = (await library).web3Provider as Web3Provider;
        const desiredChainIdHex = `0x${(80001).toString(16)}`;
        await web3Provider.send("wallet_switchEthereumChain", [
          { chainId: desiredChainIdHex },
        ]);

        router.push("/chat");
      }
    };

    start();
  }, [active, library]);

  return <Connect />;
};

export default Home;
