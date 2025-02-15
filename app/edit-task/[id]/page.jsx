'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }

        const task = await response.json();
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to fetch task details');
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        return response.json();
      })(),
      {
        pending: 'Updating task...',
        success: {
          render: 'Task updated successfully!',
          onClose: () => router.push('/home'), // Redirect after success
        },
        error: 'Failed to update task',
      }
    );
  };

  const handleCancel = () => {
    router.push('/home');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 className="text-2xl font-bold mb-4 lg:mx-20">Edit Task</h1>
      <form onSubmit={handleSubmit} className="lg:mx-20">
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
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-400 p-2 w-full mb-4"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update Task
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
