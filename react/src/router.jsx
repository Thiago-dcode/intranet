import react from "react";
import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/layout/GuestLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./views/Login";
import Home from "./views/Home.jsx";
import Intranet from "./views/Intranet/Home";
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
        path: "",
        element: <Home />,
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
        path: "",
        element: <Home />,
      },
    ],
  },
]);

export default router;
