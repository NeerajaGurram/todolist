'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Authentication failed');
      return;
    }

    if (isSignUp) {
      setIsSignUp(false); // Redirect to Sign In after signup
    } else {
      localStorage.setItem('token', data.token);
      router.push('/home');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
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
    </div>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function Home() {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/tasks', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       setTasks(data);
//     };
//     fetchTasks();
//   }, []);

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem('token');
//     await fetch(`/api/tasks/${id}`, {
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setTasks(tasks.filter((task) => task._id !== id));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
//       <Link href="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
//         Add Task
//       </Link>
//       <ul>
//         {tasks.map((task) => (
//           <li key={task._id} className="border p-4 mb-2 rounded">
//             <h2 className="font-bold">{task.title}</h2>
//             <p>{task.description}</p>
//             <p>Status: {task.status}</p>
//             <Link href={`/edit-task/${task._id}`} className="text-blue-500 mr-2">
//               Edit
//             </Link>
//             <button onClick={() => handleDelete(task._id)} className="text-red-500">
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }