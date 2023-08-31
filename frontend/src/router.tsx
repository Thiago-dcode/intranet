import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/layout/GuestLayout";
import Home from "./views/Home"
import Login from "./views/Login";
const router = createBrowserRouter([

    {
        path: '/',
        element: <Home />

    },
    {
        path: '/login',
        element: <Login />

    },
    {
        path: '/',
        element: <GuestLayout/>,
        children:[
            {
                path: '/login',
                element: <Login />
        
            },

        ]
    }


])

export default router;