import { createBrowserRouter } from "react-router-dom";
import LayoutDefault from "../layouts/LayoutDefault";
import Home from "../pages/Candidate/Home.jsx";
import Dashboard from "../pages/Admin/Dashboard";
import Home1 from "../pages/Employer/Home";
import Error from "../pages/Error.jsx/Error";
import AdminLayout from "../layouts/AdminLayout";
import EmployerLayout from "../layouts/EmployerLayout";
import Job from "../pages/Admin/RecruitmentNewsManagement/Job.jsx";
import About from "../pages/Employer/About";
import JobManagement from "../pages/Employer/Jobs/index.jsx";
import CVBuilder from "../pages/Candidate/CVBuilder/index.jsx";
import CVDashboard from "../pages/Candidate/CVDashboard/index.jsx";
import Jobs from "../pages/Candidate/Jobs.jsx";
import JobDetail from "../pages/Candidate/JobDetail.jsx";
import SavedJobs from "../pages/Candidate/SavedJobs.jsx";
import AppliedJobs from "../pages/Candidate/AppliedJobs.jsx";
import RecruitmentAccountForm from "../pages/Employer/company/RecruitmentAccountForm.jsx";
import Login from "../pages/Employer/Login/login.jsx";
import LoginAM from "../pages/Admin/Login/login.jsx";
import LoginCD from "../pages/Candidate/Login/login.jsx";
import PricingSection from "../pages/Employer/Pricing/PricingSection.jsx";
import CheckoutPage from "../pages/Employer/Payment/CheckoutPage.jsx";
import Candidates from "../pages/Employer/Candidates/CVManagement.jsx";
import EmployerList from "../pages/Admin/EmployerManagement/EmployerList";
import PendingApprovals from "../pages/Admin/CompanyApproval";
import CandidateManagement from "../pages/Admin/CandidateManagement/index.jsx";

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
            },
            {
                path: "/saved-jobs",
                element: <SavedJobs />
            },
            {
                path: "/applied-jobs",
                element: <AppliedJobs />
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
                path: '/admin/jobs',
                element: <Job />,
            },
            {
                path: '/admin/recruiters',
                element: <EmployerList />,
            },
            {
                path: '/admin/candidates',
                element: <CandidateManagement />,
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
