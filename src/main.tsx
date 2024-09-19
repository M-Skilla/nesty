import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./page/MainPage.tsx";
import SignInPage from "./page/SignInPage.tsx";
import SignUpPage from "./page/SignUpPage.tsx";
import ProtectedRoute from "./layout/ProtectedRoute.tsx";
// import ProtectedRoute from "./layout/ProtectedRoute.tsx";

export const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing publishable key!");
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [{ path: "/", element: <MainPage /> }],
      },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
