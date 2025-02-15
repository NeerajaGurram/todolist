'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('recent');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
      return;
    }

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
    toast.promise(
      fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        pending: 'Deleting task...',
        success: 'Task deleted successfully!',
        error: 'Failed to delete task.',
      }
    ).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  // Function to toggle task status
  const toggleTaskStatus = async (task) => {
    const token = localStorage.getItem('token');
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';

    toast.promise(
      fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      }),
      {
        pending: 'Updating task status...',
        success: 'Task status updated successfully!',
        error: 'Failed to update task status.',
      }
    ).then((response) => {
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? { ...t, status: updatedStatus } : t
          )
        );
      }
    });
  };

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort tasks based on the selected criteria
  const sortedTasks = filteredTasks.sort((a, b) => {
    // Default sorting: pending tasks at the top, completed tasks at the bottom
    if (a.status === 'pending' && b.status === 'completed') return -1; // a comes first
    if (a.status === 'completed' && b.status === 'pending') return 1; // b comes first

    // If both tasks have the same status, sort by the selected criteria
    if (sortCriteria === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortCriteria === 'date') {
      return new Date(b.updatedAt) - new Date(a.updatedAt); // Most recent first
    } else if (sortCriteria === 'status') {
      // If sorting by status, pending comes before completed
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return 0;
    } else {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  return (
    <div className="container max-w-screen mx-auto p-4">
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

      <div className="flex justify-between items-center mb-4 lg:mx-20">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-4 lg:mx-20">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Sorting and Filtering Options */}
      <div className="flex gap-4 mb-4 lg:mx-20">
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="recent">Sort by Recent</option>
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
<ul>
  {sortedTasks.length > 0 ? (
    sortedTasks.map((task) => (
      <li
        key={task._id}
        className={`p-4 mb-2 rounded lg:mx-20 ${
          task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
        }`}
      >
        <div className="flex items-center justify-start space-x-5">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => toggleTaskStatus(task)}
            className="ml-4 h-5 w-5"
          />
          <div>
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p className="text-gray-500">{new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-2 ml-14">
          <Link href={`/edit-task/${task._id}`} className="bg-blue-500 text-white mr-2 rounded p-1">
            Edit
          </Link>
          <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white rounded p-1">
            Delete
          </button>
        </div>
      </li>
    ))
  ) : (
    <li className="p-4 mb-2 rounded lg:mx-20 bg-gray-100 text-center">
      <p className="text-gray-500">No tasks yet, add a task!</p>
    </li>
  )}
</ul>
    </div>
  );
}
