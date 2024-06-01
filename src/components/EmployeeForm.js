import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import eye icons from react-icons library

const EmployeeForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      console.error('Please fill in all required fields.');
      toast.error("All fields are required");
      return;
    }
    try {
      const response = await axios.post('https://suplierdatabackend-2.onrender.com/api/v1/login', {
        email,
        password
      });
      console.log('User Logged In successfully:', response.data);
      
      // Store the token in local storage
      const token = localStorage.setItem('token', response.data.token);
      
      setEmail('');
      setPassword('');
      toast.success("User Logged In Successfully");
      navigate('/homepage');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If credentials are wrong, show error toast
        toast.error("Invalid email or password");
      } else {
        console.error('Error:', error.message);
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-5">
          
          <div>
            <label htmlFor="email" className="text-base font-medium text-gray-900 dark:text-gray-200">
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-base font-medium text-gray-900 dark:text-gray-200">
              Password
            </label>
            <div className="mt-2.5 relative">
              <input
                id="password"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                type={showPassword ? "text" : "password"} // Show or hide password based on state
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye icon to toggle password visibility */}
              {showPassword ? (
                <FiEyeOff className="absolute top-3 right-3 text-gray-400 dark:text-gray-600 cursor-pointer" onClick={togglePasswordVisibility} />
              ) : (
                <FiEye className="absolute top-3 right-3 text-gray-400 dark:text-gray-600 cursor-pointer" onClick={togglePasswordVisibility} />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-base font-semibold leading-7 text-white hover:bg-indigo-500"
            >
              LOGIN
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-2 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EmployeeForm;
