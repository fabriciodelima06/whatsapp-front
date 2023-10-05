import { createBrowserRouter  } from "react-router-dom";

import { Auth } from "../pages/auth";
import { Home } from "../pages/home";

export const router = props => {

    const user = localStorage.getItem("user");

    return createBrowserRouter([
        { path: '/*', element: user ? <Home /> : <Auth /> },
    ])
};