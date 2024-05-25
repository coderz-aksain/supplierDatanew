// import { Route, Routes } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import CreateEmployeePage from "./pages/CreateEmployeePage";

// function App() {
  
//   return (
//     <div>
//       <Routes>
//         <Route path="/homepage" element={<HomePage />} />
//         <Route path="/" element={<CreateEmployeePage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


// import { Route, Routes, Navigate } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import CreateEmployeePage from "./pages/CreateEmployeePage";

// // Function to check if user is authenticated
// const isAuthenticated = () => {
 
//   const token = localStorage.getItem("token");
//   console.log("This is your token", token);
//   return token !== null; 
// };

// // PrivateRoute component to protect routes
// const PrivateRoute = ({ element, path }) => {
//   return isAuthenticated() ? (
//     element
//   ) : (
//     <Navigate to="/" replace state={{ from: path }} />
//   );
// };

// function App() {
//   return (
//     <div>
//       <Routes>
       
//         <Route
//           path="/homepage"
//           element={<PrivateRoute element={<HomePage />} path="/homepage" />}
//         />
//         <Route path="/" element={<CreateEmployeePage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateEmployeePage from "./pages/CreateEmployeePage";

// Function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // console.log("This is your token", token);
  return token !== null; 
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/homepage');
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<CreateEmployeePage />} />
      </Routes>
    </div>
  );
}

export default App;
