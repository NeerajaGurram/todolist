'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'; // Import the toast functions
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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
    toast.info('Loading...', { autoClose: false }); // Show loading toast

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
    const payload = isSignUp
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        toast.error(data.error || 'Authentication failed');
        return;
      }

      if (isSignUp) {
        setIsSignUp(false); // Redirect to Sign In after signup
        toast.success('Signup successful! Please sign in.', { autoClose: 3000 });
      } else {
        localStorage.setItem('token', data.token);
        toast.success('Signed in successfully!', { autoClose: 3000 });
        router.push('/home');
      }
    } catch (err) {
      setError('An error occurred.');
      toast.error('An error occurred, please try again!');
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

      
      <ToastContainer />
    </div>
  );
}
