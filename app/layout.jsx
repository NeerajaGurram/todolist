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
        <div className="min-h-screen">
          <nav className="p-4 border-b flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Task Manager</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-blue-500 font-semibold">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="text-red-500">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/" className="text-blue-500">Sign In</Link>
            )}
          </nav>
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}

// 'use client';
// import "./globals.css";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function Layout({ children }) {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       fetch('/api/auth/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.email) setUser(data);
//         })
//         .catch(() => localStorage.removeItem('token'));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/');
//   };

//   return (
//     <html lang="en">
//  <body>
//     <div className="min-h-screen">
//       <nav className="p-4 border-b flex justify-between">
//         <Link href="/" className="text-xl font-bold">Task Manager</Link>
//         {user ? (
          
//           <div className="flex gap-4">
//             <span className="font-semibold">{user.email}</span>
//             <button onClick={handleLogout} className="text-red-500">Logout</button>
//           </div>
//         ) : (
//           <Link href="/" className="text-blue-500">Sign In</Link>
//         )}
//       </nav>
//       <main className="p-4">{children}</main>
//     </div>
//     </body>
//     </html>

//   );
// }

// // import "./globals.css";

// // import Link from 'next/link';

// // export default function Layout({ children }) {
// //   return (
// //     <html lang="en">
// //       <body>
// //     <div>
// //       <nav className="bg-blue-500 p-4 flex justify-between items-center">
// //         <Link href="/" className="text-white text-xl font-bold">
// //           Task Manager
// //         </Link>
// //         <Link href="/profile" className="text-white">
// //           Profile
// //         </Link>
// //       </nav>
// //       <main>{children}</main>
// //     </div>
// //     </body>
// //     </html>
// //   );
// // }

