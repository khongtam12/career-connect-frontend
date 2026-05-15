import { createBrowserRouter } from "react-router-dom";

import LayoutDefault from "../layouts/LayoutDefault";
import EmployerLayout from "../layouts/EmployerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Candidate/Home.jsx";
import Jobs from "../pages/Candidate/Jobs.jsx";
import JobDetail from "../pages/Candidate/JobDetail.jsx";
import SavedJobs from "../pages/Candidate/SavedJobs.jsx";
import AppliedJobs from "../pages/Candidate/AppliedJobs.jsx";
import CVBuilder from "../pages/Candidate/CVBuilder/index.jsx";
import CVDashboard from "../pages/Candidate/CVDashboard/index.jsx";

import Home1 from "../pages/Employer/Home";
import About from "../pages/Employer/About";
import JobManagement from "../pages/Employer/Jobs";
import RecruitmentAccountForm from "../pages/Employer/company/RecruitmentAccountForm.jsx";
import PricingSection from "../pages/Employer/Pricing/PricingSection.jsx";
import CheckoutPage from "../pages/Employer/Payment/CheckoutPage.jsx";
import Candidates from "../pages/Employer/Candidates/CVManagement.jsx";

import Dashboard from "../pages/Admin/Dashboard";
import Job from "../pages/Admin/RecruitmentNewsManagement/Job.jsx";
import EmployerList from "../pages/Admin/EmployerManagement/EmployerList";
import CandidateManagement from "../pages/Admin/CandidateManagement";
import PendingApprovals from "../pages/Admin/CompanyApproval";

import LoginCD from "../pages/Candidate/Login/login.jsx";
import Login from "../pages/Employer/Login/login.jsx";
import LoginAM from "../pages/Admin/Login/login.jsx";

import Error from "../pages/Error.jsx/Error";

import PrivateCandidateRouteRedirect from "./PrivateCandidateRouteRedirect";
import PrivateEmployerRouteRedirect from "./PrivateEmployerRouteRedirect";
import PrivateAdminRouteRedirect from "./PrivateAdminRouteRedirect";

export const router = createBrowserRouter([
    // ================= PUBLIC + CANDIDATE =================
    {
        path: "/",
        element: (

            <LayoutDefault />

        ),
        children: [
            {
                index: true,
                element: <Home />
            },

            {
                path: "jobs",
                element: <Jobs />
            },

            {
                path: "job/:id",
                element: <JobDetail />
            },

            {
                path: "saved-jobs",
                element: <SavedJobs />
            },

            {
                path: "applied-jobs",
                element: <AppliedJobs />
            },

            {
                path: "cv-dashboard",
                element: (
                    <PrivateCandidateRouteRedirect>
                        <CVDashboard />
                    </PrivateCandidateRouteRedirect>
                )
            },

            {
                path: "cv-builder",
                element: (
                    <PrivateCandidateRouteRedirect>
                        <CVBuilder />
                    </PrivateCandidateRouteRedirect>
                )
            }
        ]
    },

    // ================= LOGIN =================
    {
        path: "/login",
        element: <LoginCD />
    },

    {
        path: "/employer/login",
        element: <Login />
    },

    {
        path: "/admin/login",
        element: <LoginAM />
    },


    // ================= EMPLOYER =================
    {
        path: "/employer",
        element: (
            <PrivateEmployerRouteRedirect>
                <EmployerLayout />
            </PrivateEmployerRouteRedirect>
        ),
        children: [
            {
                index: true,
                element: <Home1 />
            },

            {
                path: "about",
                element: <About />
            },

            {
                path: "jobs",
                element: <JobManagement />
            },

            {
                path: "recruitment-account",
                element: <RecruitmentAccountForm />
            },

            {
                path: "pricing",
                element: <PricingSection />
            },

            {
                path: "payment",
                element: <CheckoutPage />
            },

            {
                path: "candidates",
                element: <Candidates />
            }
        ]
    },

    // ================= ADMIN =================
    {
        path: "/admin",
        element: (
            <PrivateAdminRouteRedirect>
                <AdminLayout />
            </PrivateAdminRouteRedirect>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },

            {
                path: "jobs",
                element: <Job />
            },

            {
                path: "recruiters",
                element: <EmployerList />
            },

            {
                path: "candidates",
                element: <CandidateManagement />
            },

            {
                path: "company-approvals",
                element: <PendingApprovals />
            }
        ]
    },

    // ================= ERROR =================
    {
        path: "/404",
        element: <Error />
    },

    {
        path: "*",
        element: <Error />
    }
]);