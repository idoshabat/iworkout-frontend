'use client';
import Link from 'next/link';
import { useUser } from '../lib/UserContext';
import { logout } from '../lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function TrainerNavbar() {
    const { user, setUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setUser(null);
        setIsOpen(false);
    };

    return (
        <nav className="w-full bg-black text-white p-4 border-b-2 border-b-amber-50">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-3xl font-bold hover:text-amber-200">
                    Iworkout
                </Link>

                {/* Desktop links */}
                {user && (
                    <div className="hidden md:flex gap-8 text-lg">
                        <Link href="/my-profile" className="hover:text-gray-300">Profile</Link>
                        <Link href="/drills" className="hover:text-gray-300">Drills</Link>
                        <Link href="/workouts" className="hover:text-gray-300">Workouts</Link>
                        <Link href="/my-athletes" className="hover:text-gray-300">My Athletes</Link>
                        <Link href="/my-plans" className="hover:text-gray-300">My Plans</Link>
                        {/* <Link href="/invitations" className="hover:text-gray-300">Invitations</Link> */}
                        {/* <Link href="/find-athlete" className="hover:text-gray-300">Find Athlete</Link> */}
                    </div>
                )}

                {/* Right side buttons */}
                <div className="hidden md:flex gap-6 text-lg">
                    {!user ? (
                        <>
                            <Link href="/login" className="hover:text-gray-300">Login</Link>
                            <Link href="/signup" className="hover:text-gray-300">Sign Up</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="hover:text-gray-300 text-red-500">
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="mt-4 flex flex-col gap-4 md:hidden text-lg">
                    {user && (
                        <>
                            <Link href="/my-profile" onClick={() => setIsOpen(false)}>Profile</Link>
                            <Link href="/drills" onClick={() => setIsOpen(false)}>Drills</Link>
                            <Link href="/workouts" onClick={() => setIsOpen(false)}>Workouts</Link>
                            <Link href="/my-athletes" onClick={() => setIsOpen(false)}>My Athletes</Link>
                            <Link href="/my-plans" onClick={() => setIsOpen(false)}>My Plans</Link>
                            {/* <Link href="/invitations" onClick={() => setIsOpen(false)}>Invitations</Link> */}
                            {/* <Link href="/find-athlete" onClick={() => setIsOpen(false)}>Find Athlete</Link> */}
                        </> 
                    )}

                    {!user ? (
                        <>
                            <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="text-red-500">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
