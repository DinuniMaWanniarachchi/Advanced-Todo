import { useState } from 'react';
import { signup } from '@/api/auth.api.services';
import { useNavigate } from 'react-router-dom';

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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="input mb-2 w-full" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input mb-2 w-full" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input mb-4 w-full" />
      <button onClick={handleSignup} className="btn btn-primary w-full">Sign Up</button>
    </div>
  );
}
