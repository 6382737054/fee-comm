import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Lock, User, Building } from 'lucide-react';
import api from '../api/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userTypes, setUserTypes] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    fetchUserTypes();
  }, []);

  useEffect(() => {
    if (selectedUserType && !isRegistering) {
      fetchUserNames(selectedUserType);
    }
  }, [selectedUserType, isRegistering]);

  const fetchUserTypes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/getLoginUserTypes');
      // Extract the user types from the results array
      if (response.data && response.data.results) {
        setUserTypes(response.data.results);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch user types');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserNames = async (userType) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/getUserNamesByUserType?userType=${userType}`);
      // Extract usernames from the results array
      if (response.data && response.data.results) {
        // Map to get just the userName values
        const names = response.data.results.map(user => user.userName);
        setUserNames(names);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch usernames');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUserType || !selectedUserName || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/login', {
        userType: selectedUserType,
        userName: selectedUserName,
        password: password
      });
      
      // Store the complete login response data in localStorage
      localStorage.setItem('loginResponse', JSON.stringify(response.data));
      
      // Keep existing authentication storage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify({
        userType: selectedUserType,
        userName: selectedUserName
      }));

      console.log('Login successful:', response.data);
      setError('');
      navigate('/home');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedUserType || !newUserName || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/register', {
        userType: selectedUserType,
        userName: newUserName,
        password: password
      });
      console.log('Registration successful:', response.data);
      setError('');
      setIsRegistering(false);
      setNewUserName('');
      setPassword('');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSelectedUserName('');
    setNewUserName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" alt="TN Government Logo" className="w-20 h-20" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Tamil Nadu Government</h2>
          <p className="mt-2 text-gray-600">Portal {isRegistering ? 'Registration' : 'Login'}</p>
        </div>

        {/* Form */}
        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* User Type Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <div className="relative">
              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="">Select User Type</option>
                {userTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Username Field */}
          {isRegistering ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new username"
                  disabled={isLoading}
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <select
                  value={selectedUserName}
                  onChange={(e) => setSelectedUserName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedUserType || isLoading}
                >
                  <option value="">Select Username</option>
                  {userNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>

          {/* Toggle Login/Register */}
          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;