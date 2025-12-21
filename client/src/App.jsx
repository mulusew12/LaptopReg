import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './admin/NavBar'; // Assuming this path is correct
import Dashboard from './admin/Dashboard'; // Assuming this path is correct
import Login from './users/Login'; // Corrected usage
import StudentRegistration from './users/Login'; // Assuming StudentRegistration is meant to be a separate component, or Login is being reused/misnamed
import Welcome from './shared/Welcome'; // Assuming this path is correct
import Registration from './users/Registration';
import { useAppContext } from './auth/Context';
import Lists from './admin/Lists';
import Verify from './admin/Verify';
import { Toaster} from 'react-hot-toast'
import Success from './shared/Success';
import Password from './shared/Password';

// Use a loading state to conditionally show the Welcome screen
const App = () => {
  // 1. Initialize state to track if the welcome screen is visible
  const { user, form, setForm} = useAppContext();
  const [showWelcome, setShowWelcome] = useState(true);
  // 2. Use useEffect to handle the side effect (timer)
  useEffect(() => {
    // Set a timer to hide the Welcome screen after 3000ms (3 seconds)
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    // Cleanup function: Clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  // 3. Define the Dashboard layout component inside App or separately
  const AdminLayout = () => {
    return (
      <div className='flex flex-col min-h-screen'>
        {/* You may want a different NavBar for Admin section */}
        <NavBar /> 
        <Dashboard />
      </div>
    );
  };
  
  // Note: StudentRegistration is likely meant to be a different component than Login.
  // I'm keeping the component name the same as in your original import for now.

  return (
    // Routes must be wrapped in a Router (e.g., BrowserRouter) to work
    
      <div>
        {/* 4. Conditional Rendering: Show Welcome screen if showWelcome is true */}
        <Toaster/>
        {showWelcome ? (
          <Welcome />
        ) : (
          // 5. Routes are only rendered after the welcome screen is gone
          <div>


        
         <NavBar/>
          <Routes>
            {/* 6. Correct component rendering: use element prop and JSX syntax */}
            <Route path='/' element={ !user ?  <Login /> : <AdminLayout/> } />
            {/* Note: I'm assuming you meant to route to a Registration component, 
               but using Login as per your original import */}
              
            <Route path='/register' element={ !user ?  <Login /> : <Registration/> } /> 
             <Route path='/verify/:id' element={!user ?  <Login /> :<Verify />} />
             <Route path='/list' element={!user ?  <Login /> : <Lists />} />
             <Route path='/success' element={<Success />} />
             <Route path='/password' element={<Password/>} />
            {/* Example: A dedicated registration page */}
            {/* <Route path='/register' element={<StudentRegistrationComponent />} /> */}
          </Routes>
            </div>
        )}
      </div>
    
  );
};

export default App;