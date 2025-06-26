import { useState } from 'react';
import { login } from '@/api/auth.api.services';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login(email, password);
    if (res.token) {
      loginUser(res.user, res.token);
      navigate('/dashboard'); // redirect to protected page
    } else {
      alert(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input mb-2 w-full" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input mb-4 w-full" />
      <button onClick={handleLogin} className="btn btn-primary w-full">Login</button>
    </div>
  );
}
