import { useEffect } from "react";
import { useNavigate } from "react-router";
import { subscribeLegacyHashRoutes } from "../seo/navigation";

export function LegacyHashBridge() {
  const navigate = useNavigate();
  useEffect(
    () =>
      subscribeLegacyHashRoutes(window, (target) => {
        void navigate(target, { replace: true });
      }),
    [navigate],
  );
  return null;
}
