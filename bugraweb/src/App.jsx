import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';

import ManageProjects from './pages/admin/ManageProjects';
import ManagePackages from './pages/admin/ManagePackages';
import ManageFaqs from './pages/admin/ManageFaqs';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">
       {children}
    </main>
    <Footer />
  </>
);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <Router>
          <ScrollToTop />
          
          <div className="min-h-screen bg-light text-dark font-sans selection:bg-primary selection:text-white">
            <Routes>
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
              <Route path="/portfolio/:id" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              
              <Route path="/login" element={<Login />} />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                  <Route index element={<Navigate to="projects" replace />} />
                  <Route path="projects" element={<ManageProjects />} />
                  <Route path="packages" element={<ManagePackages />} />
                  <Route path="faqs" element={<ManageFaqs />} />
              </Route>
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;