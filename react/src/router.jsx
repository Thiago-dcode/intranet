
import react from 'react'
import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/layout/GuestLayout";
import Login from "./views/Login";
import Home from "./views/Home.jsx";
const router = createBrowserRouter([
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
