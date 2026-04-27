import { createBrowserRouter } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/Candidate/Home.jsx";
import Dashboard from "../pages/Admin/Dashboard";
import Home1 from "../pages/Employer/Home";
import Error from "../pages/Error.jsx/Error";
import AdminLayout from "../layouts/AdminLayout";
import EmployerLayout from "../layouts/EmployerLayout";
import Job from "../pages/Admin/Job";
import About from "../pages/Employer/About";
import JobManagement from "../pages/Employer/Jobs/index.jsx";
import CVBuilder from "../pages/Candidate/CVBuilder/index.jsx";
import CVDashboard from "../pages/Candidate/CVDashboard/index.jsx";
import Jobs from "../pages/Candidate/Jobs.jsx";
import JobDetail from "../pages/Candidate/JobDetail.jsx";
import RecruitmentAccountForm from "../pages/Employer/company/RecruitmentAccountForm.jsx";
import Login from "../pages/Employer/Login/login.jsx";
import LoginAM from "../pages/Admin/Login/login.jsx";
import LoginCD from "../pages/Candidate/Login/login.jsx";
import PricingSection from "../pages/Employer/Pricing/PricingSection.jsx";
import CheckoutPage from "../pages/Employer/Payment/CheckoutPage.jsx";
import Candidates from "../pages/Employer/Candidates/index.jsx";
import RecruiterList from "../pages/Admin/RecruiterManagement/RecruiterList";
import PendingApprovals from "../pages/Employer/company/PendingApprovals";
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginCD />
    },
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/cv-dashboard",
                element: <CVDashboard />
            },
            {
                path: "/cv-builder",
                element: <CVBuilder />
            },
            {
                path: "/jobs",
                element: <Jobs />

            },
            {
                path: "/job/:id",
                element: <JobDetail />
            }
        ]
    },
    {
        path: "/employer/login",
        element: <Login />
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
            },
            {
                path: '/employer/recruitment-account',
                element: <RecruitmentAccountForm />
            },
            {
                path: "/employer/pricing",
                element: <PricingSection />
            },
            {
                path: "/employer/payment",
                element: <CheckoutPage />
            },
            {
                path: "/employer/candidates",
                element: <Candidates />
            }
        ],
    },
    {
        path: "/admin/login",
        element: <LoginAM />
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
            },
            {
                path: '/admin/recruiters',
                element: <RecruiterList />,
            },
            {
                path: '/admin/company-approvals',
                element: <PendingApprovals />,
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
