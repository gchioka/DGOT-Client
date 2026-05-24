/**
 * Entry point para build estático (VPS/nginx).
 * Não usa SSR — TanStack Router roda 100% no cliente.
 */
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

import "./styles.css";

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
