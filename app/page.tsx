'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from './components/Title';
import Link from 'next/link';

export default function Home() {
  const { user } = useUser();

  return (
    <div className="p-6 flex flex-col items-center text-center">
      {/* Hero Section */}
      <Title size="lg" subtitle="Your personal workout companion">
        Welcome {user ? `${user.first_name} the ${user.role}` : "Guest"}
      </Title>

      {/* If no user is logged in */}
      {!user && (
        <div className="mt-6 space-y-4">
          <p className="text-gray-400 text-lg">
            Join Iworkout to track workouts, connect with trainers, and improve your fitness.
          </p>
          <div className="flex gap-6 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-white hover:bg-gray-800 text-white rounded-xl"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      {/* If Athlete is logged in */}
      {user?.role === 'athlete' && (
        <div className="mt-10 grid gap-6 max-w-xl w-full">
          <Link
            href="/workouts"
            className="p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">📋 My Workouts</h2>
            <p className="text-gray-400 mt-2">Track and view your workout history.</p>
          </Link>

          <Link
            href="/invitations"
            className="p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">✉️ Invitations</h2>
            <p className="text-gray-400 mt-2">See your trainer invitations and connections.</p>
          </Link>
        </div>
      )}

      {/* If Trainer is logged in */}
      {user?.role === 'trainer' && (
        <div className="mt-10 grid gap-6 max-w-xl w-full">
          <Link
            href="/my-athletes"
            className="p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">🏋️ My Athletes</h2>
            <p className="text-gray-400 mt-2">Manage your athletes and track their progress.</p>
          </Link>

          <Link
            href="/invitations"
            className="p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">✉️ Invitations</h2>
            <p className="text-gray-400 mt-2">Send or manage athlete invitations.</p>
          </Link>
        </div>
      )}
    </div>
  );
}
