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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My tasks</h1>
      <Link href="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Task
      </Link>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="border p-4 mb-2 rounded">
            <h2 className="font-bold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p className='text-gray-500'>{task.updatedAt}</p>
            <Link href={`/edit-task/${task._id}`} className="text-blue-500 mr-2">
              Edit
            </Link>
            <button onClick={() => handleDelete(task._id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
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
//       <h1 className="text-2xl font-bold mb-4">My tasks</h1>
//       <Link href="/add-task" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
//         Add Task
//       </Link>
//       <ul>
//         {tasks.map((task) => (
//           <li key={task._id} className="border p-4 mb-2 rounded">
//             <h2 className="font-bold">{task.title}</h2>
//             <p>{task.description}</p>
//             <p>Status: {task.status}</p>
//             <p className='text-gray-500'>{task.updatedAt}</p>
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