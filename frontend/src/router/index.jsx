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
import ChatCandidate from "../pages/Candidate/ChatCandidate.jsx";
import CandidateProfile from "../pages/Candidate/Profile/CandidateProfile.jsx";
import Home1 from "../pages/Employer/Home";
import About from "../pages/Employer/About";
import JobManagement from "../pages/Employer/Jobs";
import RecruitmentAccountForm from "../pages/Employer/company/RecruitmentAccountForm.jsx";
import PricingSection from "../pages/Employer/Pricing/PricingSection.jsx";
import CheckoutPage from "../pages/Employer/Payment/CheckoutPage.jsx";
import Candidates from "../pages/Employer/Candidates/CVManagement.jsx";
import EmployerServices from "../pages/Employer/Services/EmployerServices.jsx";
import EmployerChat from "../pages/Employer/EmployerChat.jsx";
import EmployerProfile from "../pages/Employer/Profile/EmployerProfile.jsx";
import Dashboard from "../pages/Admin/Dashboard/index.jsx";
import Job from "../pages/Admin/RecruitmentNewsManagement/Job.jsx";
import EmployerList from "../pages/Admin/EmployerManagement/EmployerList";
import CandidateManagement from "../pages/Admin/CandidateManagement";
import PendingApprovals from "../pages/Admin/CompanyApproval";
import AdminProfile from "../pages/Admin/Profile/AdminProfile.jsx";
import ServiceManagement from "../pages/Admin/ServiceManagement";
import CompanyDetail from "../pages/Candidate/CompanyDetail.jsx";

import LoginCD from "../pages/Candidate/Login/login.jsx";
import RegisterCD from "../pages/Candidate/Register/Register.jsx";
import Login from "../pages/Employer/Login/login.jsx";
import EmployerRegister from "../pages/Employer/Register/Register.jsx";
import LoginAM from "../pages/Admin/Login/login.jsx";
import ForgotPassword from "../pages/Candidate/ForgotPassword.jsx";

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
                path: "company/:id",
                element: <CompanyDetail />
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
            },

            {
                path: "chat",
                element: (
                    <PrivateCandidateRouteRedirect>
                        <ChatCandidate />
                    </PrivateCandidateRouteRedirect>
                )
            }, {

                path: "profile",
                element: <CandidateProfile />
            }
        ]
    },

    // ================= LOGIN =================
    {
        path: "/login",
        element: <LoginCD />
    },
    {
        path: "/register",
        element: <RegisterCD />
    },

    {
        path: "/employer/login",
        element: <Login />
    },
    {
        path: "/employer/register",
        element: <EmployerRegister />
    },

    {
        path: "/admin/login",
        element: <LoginAM />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
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
            },

            {
                path: "services",
                element: <EmployerServices />
            },

            {

                path: "chat",
                element: <EmployerChat />
            },
            {
                path: "profile",
                element: <EmployerProfile />

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
            },

            {
                path: "profile",
                element: <AdminProfile />
            }
            ,
            {
                path: "services",
                element: <ServiceManagement />
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
