'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function GuestNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full bg-black text-white border-b-2 border-b-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold hover:text-amber-200">
                        Iworkout
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center gap-6 text-lg">
                        <Link href="/login" className="hover:text-gray-300">Login</Link>
                        <Link href="/signup" className="hover:text-gray-300">Sign Up</Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown */}
            {isOpen && (
                <div className="md:hidden bg-black px-4 pb-4 space-y-2">
                    <Link href="/login" className="block hover:text-gray-300">Login</Link>
                    <Link href="/signup" className="block hover:text-gray-300">Sign Up</Link>
                </div>
            )}
        </nav>
    );
}
