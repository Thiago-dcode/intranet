import react from "react";
import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/layout/GuestLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Login from "./views/Login";
import Home from "./views/Home.jsx";
import IntranetLayout from "./Intranet/layout/IntranetLayout";
import HomeIntranet from "./Intranet/views/Home.jsx";
import Middle from "./Intranet/views/Middle";
import Articulos from "./Intranet/views/modules/Articulos";
import { modules } from "./moduleRegister";
console.log("access");
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/:company",
        element: <IntranetLayout />,
        children: [
          {
            index: true,
            element: <HomeIntranet />,
          },
         ...modules
        ],
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
