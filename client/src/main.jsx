import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import React, { Suspense } from "react";

// Lazy load your components
const Youtube = React.lazy(() => import("./Components/Youtube.jsx"));
const Instagram = React.lazy(() => import("./Components/Instagram.jsx"));
const Facebook = React.lazy(() => import("./Components/Facebook.jsx"));
const Layout = React.lazy(() => import("./Components/Layout.jsx"));
const Home = React.lazy(() => import("./Components/Home.jsx"));
const TwitterX = React.lazy(() => import("./Components/TwitterX.jsx"));

// Create your router with lazy-loaded components
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="youtube" element={<Youtube />} />
      <Route path="instagram" element={<Instagram />} />
      <Route path="facebook" element={<Facebook />} />
      <Route path="twitterX" element={<TwitterX />} />
      <Route path="*" element={<Home />} />
    </Route>,
  ),
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Suspense>
  </QueryClientProvider>,
);
