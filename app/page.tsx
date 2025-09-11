'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from './components/Title';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useUser();

  // Generate drifting particles dynamically
  useEffect(() => {
    const container = document.getElementById("particles");
    if (container) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = 8 + Math.random() * 8 + "s";
        container.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="p-10 flex flex-col items-center text-center relative z-10">
      {/* Background particles */}
      <div id="particles" className="absolute inset-0 -z-10"></div>

      {/* Floating Dumbbell (SVG) */}
      <svg
        className="holo-dumbbell"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="12" y="22" width="8" height="20" rx="2" fill="#00f0ff"/>
        <rect x="44" y="22" width="8" height="20" rx="2" fill="#00f0ff"/>
        <rect x="20" y="28" width="24" height="8" rx="2" fill="#00f0ff"/>
      </svg>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <Title size="lg" subtitle="Your futuristic fitness companion">
          <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            Welcome {user ? `${user.first_name} the ${user.role}` : "Guest"}
          </span>
        </Title>
        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
          {user
            ? "Level up your training with data-driven workouts, AI insights, and holographic vibes ✨"
            : "Track workouts, connect with trainers, and unleash your fitness potential."}
        </p>
      </div>

      {/* No user buttons */}
      {!user && (
        <div className="flex gap-6 justify-center mt-8">
          <Link href="/signup" className="neon-btn">
            🚀 Get Started
          </Link>
          <Link href="/login" className="neon-btn">
            🔑 Login
          </Link>
        </div>
      )}

      {/* Athlete Dashboard */}
      {user?.role === 'athlete' && (
        <div className="mt-12 grid gap-10 max-w-4xl w-full sm:grid-cols-2">
          <div className="holo-card">
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <Link href="/workouts">
                <h2 className="text-2xl font-bold text-cyan-400">📋 My Workouts</h2>
                <p className="text-gray-400 mt-2">
                  Track your history with futuristic precision.
                </p>
              </Link>
            </div>
          </div>

          <div className="holo-card">
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <Link href="/subscribed-plans">
                <h2 className="text-2xl font-bold text-fuchsia-400">👤 My Plans</h2>
                <p className="text-gray-400 mt-2">
                  View and upgrade your fitness plans.
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Trainer Dashboard */}
      {user?.role === 'trainer' && (
        <div className="mt-12 grid gap-10 max-w-4xl w-full sm:grid-cols-2">
          <div className="holo-card">
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <Link href="/my-athletes">
                <h2 className="text-2xl font-bold text-green-400">🏋️ My Athletes</h2>
                <p className="text-gray-400 mt-2">
                  Manage and inspire your athletes with next-gen tools.
                </p>
              </Link>
            </div>
          </div>

          <div className="holo-card">
            <div className="hover:scale-105 transition-transform cursor-pointer">
              <Link href="/invitations">
                <h2 className="text-2xl font-bold text-yellow-400">✉️ Invitations</h2>
                <p className="text-gray-400 mt-2">
                  Send or manage invites like a pro.
                </p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
