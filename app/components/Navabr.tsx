import Link from 'next/link';

export default function Navbar() {
    return (
        <div dir="rtl">
            <nav className="w-full bg-black text-white p-4 flex items-center border-b-2 border-b-amber-50">
                {/* Right side: Logo + nav links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold hover:text-amber-200">
                        Iworkout
                    </Link>
                    <div className="flex gap-6 text-lg">
                        <Link href="/users" className="hover:text-gray-300">משתמשים</Link>
                        <Link href="/drills" className="hover:text-gray-300">תרגילים</Link>
                        <Link href="/workouts" className="hover:text-gray-300">תוכניות אימון</Link>
                    </div>
                </div>

                {/* Left side: Auth links */}
                <div className="mr-auto flex gap-6 text-lg">
                    <Link href="/login" className="hover:text-gray-300">התחבר</Link>
                    <Link href="/signup" className="hover:text-gray-300">הרשם</Link>
                </div>
            </nav>
        </div>
    );
}
