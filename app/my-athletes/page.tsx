'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from '../components/Title';
import { POST } from '../lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyAthletesPage() {
  const { user } = useUser();
  const [athletes, setAthletes] = useState<any[]>(user?.trainer_profile?.athletes || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      setAthletes(user.trainer_profile?.athletes || []);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317]">
        <Title size="lg" >Please login to view this page</Title>
      </div>
    );
  }

  if (user.role !== 'trainer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317]">
        <Title size="md" >Only trainers can view this page</Title>
      </div>
    );
  }

  const removeAthlete = async (id: string) => {
    try {
      await POST(`/users/trainers/remove-athlete/${id}/`, {});
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to remove athlete.');
    }
  };

  // 🔍 Simple search filter
  const filteredAthletes = athletes.filter((athlete) =>
    `${athlete.first_name} ${athlete.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0e0b22] to-[#050317] text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-[#6e00ff] to-[#00fff7] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(110,0,255,0.7)]">
        👟 My Athletes
      </h1>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 mb-10">
        <Link
          href="/find-athlete"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#6e00ff] to-[#00fff7] text-white font-semibold shadow-lg hover:shadow-[#00fff7]/50 hover:scale-105 transition"
        >
          Find Athlete
        </Link>
        <Link
          href="/invitations"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00fff7] to-[#6e00ff] text-white font-semibold shadow-lg hover:shadow-[#6e00ff]/50 hover:scale-105 transition"
        >
          Invitations
        </Link>
      </div>

      {/* 🔍 Search */}
      <div className="max-w-3xl mx-auto flex items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by athlete name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-[#121028]/40 border border-[#6e00ff]/40 text-white placeholder-gray-400 focus:outline-none focus:border-[#00fff7] transition"
        />
      </div>

      {/* Empty state */}
      {filteredAthletes.length === 0 ? (
        <p className="text-gray-400 text-center mt-10 text-lg italic">
          No athletes found. Try adjusting your <span className="text-[#00fff7] font-semibold">search</span>.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAthletes.map((athlete: any) => (
            <div
              key={athlete.id}
              className="relative p-6 rounded-2xl bg-[#121028]/40 border border-[#6e00ff]/40 backdrop-blur-lg shadow-lg hover:shadow-[#00fff7]/40 transition transform hover:scale-105 group"
            >
              {/* Remove button */}
              <button
                onClick={() => removeAthlete(athlete.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
              >
                ❌
              </button>

              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7]">
                {athlete.first_name} {athlete.last_name}
              </h3>

              <p className="text-gray-400 text-sm mt-2">{athlete.email}</p>
              <p className="text-gray-500 text-xs mt-1">ID: {athlete.id}</p>

              <Link
                href={`/profile?email=${athlete.email}`}
                className="mt-5 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#6e00ff] text-white font-medium shadow-md hover:shadow-[#6e00ff]/50 transition"
              >
                View Profile
              </Link>

              {/* Glow border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#6e00ff]/60 transition pointer-events-none"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
