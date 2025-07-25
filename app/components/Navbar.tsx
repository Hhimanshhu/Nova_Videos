'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left - Logo */}
      <Link href="/" className="text-xl font-bold hover:text-red-500">
        🎥 NOVI
      </Link>

      {/* Center - Nav Links (Desktop) */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className="hover:text-red-500">Home</Link>
        <Link href="/dashboard" className="hover:text-red-500">Dashboard</Link>
        {status === 'authenticated' && (
          <Link href="/upload" className="hover:text-red-500">Upload</Link>
        )}
        <Link href="/about" className="hover:text-red-500 transition-colors">
  About
</Link>

      </div>

      {/* Right - User Actions */}
      <div className="hidden md:flex items-center gap-4">
        {status === 'authenticated' ? (
          <>
            <span className="text-sm text-gray-300">{session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-red-500">Login</Link>
            <Link href="/register" className="hover:text-red-500">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden"
      >
        <Menu />
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-6 bg-gray-800 p-4 rounded shadow-lg flex flex-col gap-3 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Home</Link>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Dashboard</Link>
          {status === 'authenticated' && (
            <Link href="/upload" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Upload</Link>
          )}
          {status === 'authenticated' ? (
            <button
              onClick={() => { signOut({ callbackUrl: '/login' }); setMenuOpen(false); }}
              className="text-left hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Login</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="hover:text-red-500">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;



// 'use client';
// import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';

// const Navbar = () => {
//   const { data: session, status } = useSession();

//   return (
//     <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow-md">
//       {/* Left - Logo */}
//       <div className="flex items-center gap-2">
//         <Link href="/" className="text-xl font-bold hover:text-red-500 transition-colors">
//           🎥 VideoUploader
//         </Link>
//       </div>

//       {/* Center - Links */}
//       <div className="flex items-center gap-6">
//         <Link href="/" className="hover:text-red-500 transition-colors">
//           Home
//         </Link>
//         <Link href="/dashboard" className="hover:text-red-500 transition-colors">
//           Dashboard
//         </Link>
//         {status === 'authenticated' && (
//           <Link href="/upload" className="hover:text-red-500 transition-colors">
//             Upload
//           </Link>
//         )}
//       </div>

//       {/* Right - Auth Buttons */}
//       <div className="flex items-center gap-4">
//         {status === 'authenticated' ? (
//           <>
//             <span className="text-sm text-gray-300">
//               {session.user?.name || session.user?.email}
//             </span>
//             <button
//               onClick={() => signOut({ callbackUrl: '/login' })}
//               className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link href="/login" className="hover:text-red-500 transition-colors">
//               Login
//             </Link>
//             <Link href="/register" className="hover:text-red-500 transition-colors">
//               Register
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
