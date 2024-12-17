import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        {/* Login page without navbar */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Pages with navbar */}
        <Route
          path="/home"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route 
          path="/forms"
          element={
            <Layout>
              <FormsPage/>
            </Layout>
          }
        />
         <Route 
          path="/account7"
          element={
            <Layout>
              <Account7Form/>
            </Layout>
          }
        />
          <Route 
          path="/account56"
          element={
            <Layout>
              <Account56Form/>
            </Layout>
          }
        />
               <Route 
          path="/account6"
          element={
            <Layout>
              <Account6Form/>
            </Layout>
          }
        />


<Route 
          path="/form2"
          element={
            <Layout>
              <Account2Form/>
            </Layout>
          }
        />
        <Route 
          path="/account3"
          element={
            <Layout>
              <Account3Form/>
            </Layout>
          }
        />
            <Route 
          path="/account4"
          element={
            <Layout>
              <Account4Form/>
            </Layout>
          }
        />
        {/* Updated route with ID parameter */}
        <Route 
          path="/individual-section-form/:id"
          element={
            <Layout>
              <IndividualSectionForm/>
            </Layout>
          }
        />
        {/* Updated route with ID parameter */}
        <Route 
          path="/multiple-section-form/:id"
          element={
            <Layout>
              <MultipleSectionForm/>
            </Layout>
          }
        />
        <Route 
          path="/allocate"
          element={
            <Layout>
              <AllocationForm/>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;