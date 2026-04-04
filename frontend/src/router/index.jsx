import { createBrowserRouter } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/User/Home";
import Dashboard from "../pages/Admin/Dashboard";
import Home1 from "../pages/Employer/Home";
import Error from "../pages/Error.jsx/Error";
import AdminLayout from "../layouts/AdminLayout";
import EmployerLayout from "../layouts/EmployerLayout";
import Job from "../pages/Admin/Job";
import About from "../pages/Employer/About";
import JobManagement from "../pages/Employer/Jobs/index.jsx";
import CVBuilder from "../pages/User/CVBuilder/index.jsx";
import CVDashboard from "../pages/User/CVDashboard/index.jsx";

export const router = createBrowserRouter([
    {
        path: "/cv-dashboard",
        element: <CVDashboard />
    },
    {
        path: "/cv-builder",
        element: <CVBuilder />
    },
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    },
    {
        path: "/employer",
        element: (
            <EmployerLayout />
        ),
        children: [
            { index: true, element: <Home1 /> },
            {
                path: '/employer/about',
                element: <About />,
            },
            {
                path: '/employer/jobs',
                element: <JobManagement />,
            }
        ],
    },
    {
        path: "/admin",
        element: (
            <AdminLayout />
        ),
        children: [
            { index: true, element: <Dashboard /> },
            {
                path: '/admin/job',
                element: <Job />,
            }
        ],
    },
    {
        path: "/404",
        element: <Error />
    },
    {
        path: "*",
        element: <Error />,
    }
])