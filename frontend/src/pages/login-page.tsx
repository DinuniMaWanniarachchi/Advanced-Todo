import { useState } from 'react';
import { login } from '@/api/auth.api.services';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res.token) {
      loginUser(res.user, res.token);
      navigate('/projectpage'); // redirect to protected page
    } else {
      alert(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">Login</h2>

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
        onClick={handleLogin}
        className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
