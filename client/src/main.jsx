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
import Youtube from "./Components/Youtube.jsx";
import Instagram from "./Components/Instagram.jsx";
import Layout from "./Components/Layout.jsx";
import Home from "./Components/Home.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />{" "}
      <Route path="youtube" element={<Youtube />} />
      <Route path="instagram" element={<Instagram />} />
      <Route path="*" element={<Home />} />{" "}
    </Route>,
  ),
);

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </QueryClientProvider>,
);
