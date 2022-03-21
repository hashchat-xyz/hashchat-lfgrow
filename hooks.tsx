import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { SelfID } from "@self.id/web";

export function useSelfID() {
  const { library } = useWeb3React();
  const [waiting, setWaiting] = useState(false);
  const [selfID, setSelfID] = useState({} as SelfID);

  useEffect(() => {
    if (library && !waiting && !selfID) {
      setWaiting(true);
      const waitLibrary = async () => {
        const lib = await library;
        setSelfID(lib);
        setWaiting(false);
      };

      waitLibrary();
    }
  }, [library]);

  return { selfID: selfID };
}
