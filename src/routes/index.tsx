import { createBrowserRouter } from "react-router";
import { Home } from "../pages/home";
import { NotFound } from "../pages/not-found";
import { Route } from "./route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Route page={Home} />,
  },
  {
    path: "*",
    element: <Route page={NotFound} />,
  }
]);
