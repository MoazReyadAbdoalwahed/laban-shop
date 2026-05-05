import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Error from "../pages/Error";
import Mainlayout from "../Layout/Mainlayout";
import AllCattegories from "../pages/AllCattegories";
import Cart from "../pages/Cart";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import PlaceOrder from "../pages/PlaceOrder";
import ProductPage from "../pages/Product";
import OAuthCallback from "../pages/OAuthCallback";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Mainlayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/categories",
                element: <AllCattegories />
            },
            {
                path: "/cart",
                element: <Cart />
            },
            {
                path: "/Contact",
                element: <Contact />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/oauth-callback",
                element: <OAuthCallback />
            },
            {
                path: "/placeorder",
                element: <PlaceOrder />
            },
            {
                path: "/product/:id",
                element: <ProductPage />,
                loader: ({ params }) => {
                    if (typeof params.id !== "string" || params.id.trim() === "") {
                        return redirect("/");
                    }
                    return true;
                }
            },
        ]
    }
]);

function AppRoutes() {
    return (
        <RouterProvider router={router} />
    );
}

export default AppRoutes;

