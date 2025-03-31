import React, { useState, useEffect } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  // State for login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with a default user if no users exist
      const defaultUsers = [{ username: 'admin', password: 'admin123' }];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check if user exists and password matches
    const user = users.find(user => user.username === username);
    
    if (user && user.password === password) {
      // Call the onLoginSuccess function with the user info
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess({ username: user.username });
      } else {
        console.error("onLoginSuccess is not a function", onLoginSuccess);
        setErrorMessage("Login system error. Please contact support.");
      }
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      setErrorMessage('Username already exists');
      return;
    }
    
    // Add new user
    const newUsers = [...users, { username, password }];
    setUsers(newUsers);
    setIsRegistering(false);
    setErrorMessage('Registration successful! Please log in.');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {isRegistering ? 'Register' : 'Login'}
      </h1>
      
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-4"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setErrorMessage('');
        }}
        className="w-full text-blue-500 py-2 px-4 rounded hover:bg-gray-100 transition-colors"
      >
        {isRegistering ? 'Back to Login' : 'Create an Account'}
      </button>
      
      {!isRegistering && (
        <div className="mt-6 text-sm text-gray-500">
          <h2 className="font-medium mb-2">Registered Users:</h2>
          {users.length > 0 ? (
            <ul className="list-disc pl-5">
              {users.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))}
            </ul>
          ) : (
            <p>No users registered yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginPage;