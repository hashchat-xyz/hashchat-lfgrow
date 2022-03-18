import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Chat from "./chat";
import { useConnection } from "@self.id/framework";
import Connect from "../components/Connect";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const [connection, connect, disconnect] = useConnection();
  const router = useRouter();

  useEffect(() => {
    if (connection.status === "connected") {
      router.push("/chat");
    }
  }, [connection]);

  return <Connect />;
};

export default Home;
