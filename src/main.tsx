import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app/App";
import { canHydrate, legacyHashTarget } from "./seo/navigation";
import "./styles/global.css";
import "./styles/campaign.css";
import "./styles/faction-interactions.css";
import "./styles/copyright.css";

const root = document.getElementById("root")!;
const legacyTarget = legacyHashTarget(window.location.hash);
if (legacyTarget) window.history.replaceState(null, "", legacyTarget);
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
if (
  canHydrate(
    root.dataset.prerenderedPath,
    window.location.pathname,
    window.location.search,
    Boolean(legacyTarget),
  )
) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
