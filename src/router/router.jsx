import { createBrowserRouter, Navigate, Outlet } from "react-router";
import SignIn from "../pages/SignIn";
import { authStorage } from "../api/auth";

import Layout from "../layouts/AdminLayout";
import Overview from "../pages/dashboard/Overview";
import Services from "../pages/dashboard/Services";
import Countries from "../pages/dashboard/Countries";
import Ranges from "../pages/dashboard/Ranges";
import Numbers from "../pages/dashboard/Numbers";
import Users from "../pages/dashboard/Users";

const ProtectedLayout = () => (
  authStorage.getUser() ? <Outlet /> : <Navigate to="/signin" replace />
);


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "dashboard", element: <Overview /> },
          { path: "dashboard/services", element: <Services /> },
          { path: "dashboard/countries", element: <Countries /> },
          { path: "dashboard/ranges", element: <Ranges /> },
          { path: "dashboard/numbers", element: <Numbers /> },
          { path: "dashboard/users", element: <Users /> },
        ],
      },
    ],
  },
]);