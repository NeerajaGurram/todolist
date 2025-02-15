'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
    const payload = isSignUp
      ? { name, email, password }
      : { email, password };

    // Show a waiting toast
    const toastId = toast.loading('Processing...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        toast.update(toastId, {
          render: data.error || 'Authentication failed',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }

      if (isSignUp) {
        toast.update(toastId, {
          render: 'Sign up successful! Redirecting to Sign In...',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        setIsSignUp(false); // Redirect to Sign In after signup
      } else {
        localStorage.setItem('token', data.token);
        toast.update(toastId, {
          render: 'Sign in successful! Redirecting...',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        router.push('/home');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.update(toastId, {
        render: 'An error occurred. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen">
      <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleAuth} className="w-80 border p-4 rounded">
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-4"
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p className="mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 ml-1 underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}