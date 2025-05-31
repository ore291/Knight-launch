import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AppContextProvider } from "./context/AppContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <Theme>
          <App />
        </Theme>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
