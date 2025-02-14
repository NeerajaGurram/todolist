'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Check if the page has already been reloaded
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      // Reload the page once
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
      return; // Exit early to avoid fetching tasks during the reload
    }

    // Fetch tasks after the reload
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Sort tasks: completed tasks at the bottom, recent tasks at the top
  const sortedTasks = tasks.sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1; // Move completed tasks to the bottom
    if (a.status !== 'completed' && b.status === 'completed') return -1; // Keep pending tasks at the top
    return new Date(b.updatedAt) - new Date(a.updatedAt); // Sort by recent tasks first
  });

  return (
    <div className="container max-w-screen mx-auto p-4">
      <div className="flex justify-between items-center mb-4 mx-20">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </Link>
      </div>

      <ul>
        {sortedTasks.map((task) => (
          <li
            key={task._id}
            className={`p-4 mb-2 rounded lg:mx-20 ${
              task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p className="text-gray-500">{new Date(task.updatedAt).toLocaleString()}</p>
            <div className="mt-2">
              <Link href={`/edit-task/${task._id}`} className="text-blue-500 mr-2">
                Edit
              </Link>
              <button onClick={() => handleDelete(task._id)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
