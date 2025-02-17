import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import HomePage from './pages/homepage';
import Navbar from './components/navbar';
import FormsPage from './pages/forms';
import AllocationForm from './pages/allocation';
import IndividualSectionForm from './pages/induvidualsectionform';
import MultipleSectionForm from './pages/multiplesectionform';
import Account2Form from './pages/account2';
import Account3Form from './pages/account3';
import Account4Form from './pages/account4';
import Account56Form from './pages/account56';
import Account6Form from './pages/account6';
import Account7Form from './pages/account7';
import ApprovalForm from './pages/approvalformat';
import ObjectionFormPage from './pages/objectionformat';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Check for authentication using the same localStorage key as your login page
  const loginResponse = localStorage.getItem('loginResponse');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated || !loginResponse) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Login Page */}
        <Route 
          path="/" 
          element={
            // Redirect to home if already logged in
            localStorage.getItem('isAuthenticated') === 'true' ? 
            <Navigate to="/home" replace /> : 
            <LoginPage />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <HomePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/forms"
          element={
            <ProtectedRoute>
              <Layout>
                <FormsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account7"
          element={
            <ProtectedRoute>
              <Layout>
                <Account7Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account56"
          element={
            <ProtectedRoute>
              <Layout>
                <Account56Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account6"
          element={
            <ProtectedRoute>
              <Layout>
                <Account6Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/form2"
          element={
            <ProtectedRoute>
              <Layout>
                <Account2Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account3"
          element={
            <ProtectedRoute>
              <Layout>
                <Account3Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/approve"
          element={
            <ProtectedRoute>
              <Layout>
                <ApprovalForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/objection"
          element={
            <ProtectedRoute>
              <Layout>
                <ObjectionFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account4"
          element={
            <ProtectedRoute>
              <Layout>
                <Account4Form />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/individual-section-form/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <IndividualSectionForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/multiple-section-form/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MultipleSectionForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/allocate"
          element={
            <ProtectedRoute>
              <Layout>
                <AllocationForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;