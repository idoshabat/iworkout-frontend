'use client'
import Link from 'next/link';
import { useUser } from '../lib/UserContext';
import { logout } from '../lib/utils';

export default function Navbar() {
    const { user, setUser } = useUser();

    const handleLogout = async () => {
        await logout();
        setUser(null); // immediately update navbar
    };

    return (
        <div>
            <nav className="w-full bg-black text-white p-4 flex items-center border-b-2 border-b-amber-50 mb-8">
                <div className="flex items-center gap-32">
                    <Link href="/" className="text-3xl font-bold hover:text-amber-200">
                        Iworkout
                    </Link>
                    {user &&
                        <div className="flex gap-24 text-lg">
                            <Link href="/profile" className="hover:text-gray-300">Profile</Link>
                            <Link href="/drills" className="hover:text-gray-300">Drills</Link>
                            <Link href="/workouts" className="hover:text-gray-300">Workouts</Link>
                        </div>
                    }
                </div>

                <div className="ml-auto flex gap-6 text-lg">
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
            </nav>
        </div>
    );
}
