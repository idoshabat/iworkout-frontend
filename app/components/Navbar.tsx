'use client';

import Link from 'next/link';
import { useUser } from '../lib/UserContext';
import { logout } from '../lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsOpen(false);
  };

  const navLinks = user?.role === 'athlete'
    ? [
        { name: 'Profile', href: '/my-profile' },
        { name: 'Drills', href: '/drills' },
        { name: 'Workouts', href: '/workouts' },
        { name: 'My Trainers', href: '/my-trainers' },
        { name: 'Invitations', href: '/invitations' },
        { name: 'My Plans', href: '/subscribed-plans' },
      ]
    : user?.role === 'trainer'
    ? [
        { name: 'Profile', href: '/my-profile' },
        { name: 'Drills', href: '/drills' },
        { name: 'Workouts', href: '/workouts' },
        { name: 'My Athletes', href: '/my-athletes' },
        { name: 'My Plans', href: '/my-plans' },
      ]
    : [];

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-gray-700 shadow-neon">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] drop-shadow-neon"
        >
          Iworkout
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-200 hover:text-[#00fff7] font-medium transition-all duration-300 glow-link"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex gap-6 text-lg">
          {!user ? (
            <>
              <Link href="/login" className="text-gray-200 hover:text-[#00fff7] font-semibold transition glow-link">
                Login
              </Link>
              <Link href="/signup" className="text-gray-200 hover:text-[#6e00ff] font-semibold transition glow-link">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 font-semibold transition glow-link">
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-lg bg-gray-900/70 backdrop-blur-md border-t border-gray-700 shadow-neon">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-200 hover:text-[#00fff7] font-medium transition glow-link"
            >
              {link.name}
            </Link>
          ))}

          {!user ? (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-[#00fff7] font-semibold transition glow-link">
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="text-gray-200 hover:text-[#6e00ff] font-semibold transition glow-link">
                Sign Up
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 font-semibold transition glow-link">
              Logout
            </button>
          )}
        </div>
      )}

      {/* Neon Glow Style */}
      <style jsx>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(110, 0, 255, 0.4), 0 0 40px rgba(0, 255, 247, 0.3);
        }
        .drop-shadow-neon {
          text-shadow: 0 0 6px rgba(110, 0, 255, 0.8), 0 0 10px rgba(0, 255, 247, 0.6);
        }
        .glow-link:hover {
          text-shadow: 0 0 8px #00fff7, 0 0 12px #6e00ff;
          transform: scale(1.05);
        }
      `}</style>
    </nav>
  );
}
