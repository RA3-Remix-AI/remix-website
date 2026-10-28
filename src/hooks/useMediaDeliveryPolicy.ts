import { useEffect, useState } from "react";
import { conserveCommanderData } from "../lib/commander-media";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
/** Read after hydration; keep the initial size choice so resize never downloads a second rendition. */
export function useMediaDeliveryPolicy() {
  const [policy, setPolicy] = useState({ ready: false, conserveData: true, mobile: false });
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const update = () => setPolicy({ ready: true, conserveData: conserveCommanderData(connection), mobile });
    update();
    connection?.addEventListener("change", update);
    return () => connection?.removeEventListener("change", update);
  }, []);
  return policy;
}
