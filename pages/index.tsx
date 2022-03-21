import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Chat from "./Chat";
import { useConnection } from "@self.id/framework";
import Connect from "./connect";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

const Home: NextPage = () => {
  const { active } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    if (active) {
      router.push("/chat");
    }
  }, [active]);

  return <Connect />;
};

export default Home;
