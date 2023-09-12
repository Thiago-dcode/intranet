import react from "react";
import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/layout/GuestLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./views/Login";
import Home from "./views/Home.jsx";
import Intranet from "./views/Intranet/Home";
import Middle from "./views/Intranet/Middle";
console.log("access");
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/:company",
        element: <Intranet />,
      },
      {
        path: "middle",
        element: <Middle />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;
