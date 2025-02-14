'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      router.push('/home');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  const handleCancel = () => {
    router.push('/home');
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-4 lg:mx-20">Add Task</h1>
      <form onSubmit={handleSubmit} className='lg:mx-20'>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-400 p-2 w-full mb-4"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-400 p-2 w-full mb-4"
          required
        />
        <div className='flex space-x-4'>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
        <button onClick={handleCancel} className="bg-blue-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
}
