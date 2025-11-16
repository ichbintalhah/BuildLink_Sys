import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import SubCategoryPage from "./pages/SubCategoryPage.jsx";
import ServiceJobPage from "./pages/ServiceJobPage.jsx";
import ContractorListingsPage from "./pages/ContractorListingsPage.jsx";
import ContractorProfilePage from "./pages/ContractorProfilePage.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import ActiveJobs from "./pages/Dashboard/ActiveJobs.jsx";
import BookingHistory from "./pages/Dashboard/BookingHistory.jsx";
import UserProfile from "./pages/Dashboard/UserProfile.jsx";
import TransactionHistory from "./pages/Dashboard/TransactionHistory.jsx";
import ContractorJobHistory from "./pages/Dashboard/ContractorJobHistory.jsx";
import ContractorPortfolio from "./pages/Dashboard/ContractorPortfolio.jsx";
import EarningsHistory from "./pages/Dashboard/EarningsHistory.jsx";
import ContractorProfile from "./pages/Dashboard/ContractorProfile.jsx";
// Dashboard Imports
import UserDashboard from "./pages/Dashboard/UserDashboard.jsx";
import CurrentBookings from "./pages/Dashboard/CurrentBookings.jsx";
import ContractorDashboard from "./pages/Dashboard/ContractorDashboard.jsx";
import JobRequests from "./pages/Dashboard/JobRequests.jsx";
import AdminDashboard from "./pages/Dashboard/AdminDashboard.jsx"; // Import Admin shell
import AdminPendingPayments from "./pages/Dashboard/AdminPendingPayments.jsx"; // Import Admin page

// No longer needed: import TemporaryAdminPanel from './pages/TemporaryAdminPanel.jsx';

function App() {
  return (
    <Routes>
      {/* Main Layout for public pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/category/:categoryName" element={<SubCategoryPage />} />
        <Route path="/service/:serviceName" element={<ServiceJobPage />} />
        <Route path="/job/:jobId" element={<ContractorListingsPage />} />
        <Route path="/contractor/:id" element={<ContractorProfilePage />} />
        <Route path="/booking-form/:contractorId" element={<BookingForm />} />

        {/* Removed the old temporary admin route */}
        {/* <Route path="/admin-confirm" element={<TemporaryAdminPanel />} /> */}
      </Route>

      {/* --- NEW: Nested Layout for the Admin Dashboard --- */}
      <Route path="/dashboard/admin" element={<AdminDashboard />}>
        {/* This is the default page for the admin dashboard */}
        <Route index element={<AdminPendingPayments />} />
        {/* We will add routes for disputes, users etc. here later */}
      </Route>

      {/* Nested Layout for the User Dashboard */}
      <Route path="/dashboard/user" element={<UserDashboard />}>
        <Route index element={<CurrentBookings />} />
        <Route path="history" element={<BookingHistory />} />
        <Route path="profile" element={<UserProfile />} />
        {/* --- ADD THIS LINE --- */}
        <Route path="transactions" element={<TransactionHistory />} />
        {/* --------------------- */}
      </Route>

      {/* Nested Layout for the Contractor Dashboard */}
      <Route path="/dashboard/contractor" element={<ContractorDashboard />}>
        <Route index element={<JobRequests />} />
        <Route path="active" element={<ActiveJobs />} />
        <Route path="history" element={<ContractorJobHistory />} />
        <Route path="portfolio" element={<ContractorPortfolio />} />
        <Route path="earnings" element={<EarningsHistory />} />
        {/* --- ADD THIS LINE --- */}
        <Route path="profile" element={<ContractorProfile />} />
        {/* --------------------- */}
      </Route>
    </Routes>
  );
}

export default App;
