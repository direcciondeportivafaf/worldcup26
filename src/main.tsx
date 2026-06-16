import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

// Hidden console dashboard route
if (window.location.pathname === '/consoleapi') {
  import("./services/apiLogger").then(() => {
    import("./components/ConsoleDashboard").then(({ default: ConsoleDashboard }) => {
      createRoot(document.getElementById("root")!).render(
        <StrictMode>
          <ConsoleDashboard />
        </StrictMode>
      );
    });
  });
} else {
  import("./App").then(({ default: App }) => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
        <Analytics />
      </StrictMode>
    );
  });
}
