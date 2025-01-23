import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import QueryClientProviderComponent from "./providers/query-provider.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <QueryClientProviderComponent>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </QueryClientProviderComponent>
  </>
);
