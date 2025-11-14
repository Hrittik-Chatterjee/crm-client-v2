import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { store } from "@/redux/store";
import { router } from "@/routes";
import "./index.css";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light" storageKey="crm-theme">
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
