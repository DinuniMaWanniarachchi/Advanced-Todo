import { useState } from 'react';
import { signup } from '@/api/auth.api.services';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await signup(username, email, password);
    if (res.token) {
      alert('Signup successful! Please login.');
      navigate('/login');
    } else {
      alert(res.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Sign Up</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="input mb-2 w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="input mb-2 w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="input mb-4 w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
      />

      <button
        onClick={handleSignup}
        className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Sign Up
      </button>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Login
        </Link>
      </p>
    </div>
  );
}
