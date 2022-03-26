import type { NextPage } from "next";
import Connect from "./connect";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

const Home: NextPage = () => {
  const { active } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    const start = async () => {
      if (active) {
        router.push("/chat");
      }
    };

    start();
  }, [active]);

  return <Connect />;
};

export default Home;
