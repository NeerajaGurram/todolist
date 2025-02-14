'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, email }),
    });
    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
    }
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 lg:mx-20">Profile</h1>
      <form onSubmit={handleSubmit} className="lg:mx-20">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-400 p-2 w-full mb-4"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-400 p-2 w-full mb-4"
          required
        />
        <div className='flex space-x-4'>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Profile
        </button>
          <button onClick={handleCancel} className="bg-blue-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
}

