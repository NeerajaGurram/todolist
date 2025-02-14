'use client';
import "./globals.css";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.name) setUser(data);
          })
          .catch(() => localStorage.removeItem('token'));
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <html lang="en">
      <body>
        <div className="max-h-screen">
          <nav className="p-4 border-b flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Task Manager</Link>
            
            {user && (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-blue-500 font-semibold">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-red-500">
                  Sign Out
                </button>
              </div>
            )}
          </nav>
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}