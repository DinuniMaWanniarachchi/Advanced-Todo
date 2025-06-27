import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Todo Project Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
          Manage your personal and team projects efficiently. Create tasks, set priorities,
          organize with projects — all in one simple platform.
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={handleLoginClick} className="px-6 py-2 text-lg">
            Login
          </Button>
          <Button onClick={handleSignUpClick} variant="outline" className="px-6 py-2 text-lg">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}