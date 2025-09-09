'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from '../components/Title';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MyTrainersPage() {
  const { user } = useUser();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role === 'athlete') {
      setTrainers(user.athlete_profile?.trainers || []);
    }
  }, [user]);

  const filteredTrainers = trainers.filter((trainer) =>
    `${trainer.first_name} ${trainer.last_name} ${trainer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317]">
        <Title size="lg" >Please login to view this page</Title>
      </div>
    );
  }

  if (user.role !== 'athlete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317]">
        <Title size="md" >Only athletes can view this page</Title>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317] text-center">
        <Title size="md" >You don’t have a trainer yet</Title>
        <div className="flex flex-row gap-4 mb-6">
          <Link
            href="/find-trainer"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#6e00ff] to-[#00fff7] text-white font-semibold shadow-lg hover:shadow-[#00fff7]/50 hover:scale-105 transition"
          >
            Find Trainer
          </Link>
          <Link
            href="/invitations"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00fff7] to-[#6e00ff] text-white font-semibold shadow-lg hover:shadow-[#6e00ff]/50 hover:scale-105 transition"
          >
            Invitations
          </Link>
        </div>
        <p className="text-gray-400 mt-2 text-lg">
          Ask your trainer to add you or check your invitations.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#0e0b22] to-[#050317]">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#6e00ff] to-[#00fff7] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(110,0,255,0.7)]">
        🏋️ My Trainers
      </h1>

      {/* Search bar */}
      <div className="mt-6 flex justify-center">
        <input
          type="text"
          placeholder="Search trainers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-xl bg-[#121028]/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6e00ff] shadow-md backdrop-blur-md transition"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mt-6 mb-10">
        <Link
          href="/find-trainer"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#6e00ff] to-[#00fff7] text-white font-semibold shadow-lg hover:shadow-[#00fff7]/50 hover:scale-105 transition"
        >
          Find Trainer
        </Link>
        <Link
          href="/invitations"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00fff7] to-[#6e00ff] text-white font-semibold shadow-lg hover:shadow-[#6e00ff]/50 hover:scale-105 transition"
        >
          Invitations
        </Link>
      </div>

      {/* Trainers List */}
      <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer.id}
            className="relative p-6 rounded-2xl bg-[#121028]/40 border border-[#6e00ff]/40 backdrop-blur-lg shadow-lg hover:shadow-[#00fff7]/40 transition transform hover:scale-105 group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6e00ff] to-[#00fff7] flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg">
              {trainer.first_name[0]}
              {trainer.last_name[0]}
            </div>

            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7]">
              {trainer.first_name} {trainer.last_name}
            </h2>
            <p className="text-gray-400 mt-1">{trainer.email}</p>
            {trainer.bio && <p className="text-gray-400 mt-2 text-sm">{trainer.bio}</p>}

            <Link
              href={`/profile?email=${trainer.email}`}
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-[#00fff7] to-[#6e00ff] text-white font-medium shadow-md hover:shadow-[#6e00ff]/50 transition"
            >
              View Profile
            </Link>

            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#6e00ff]/60 transition pointer-events-none"></div>
          </div>
        ))}

        {filteredTrainers.length === 0 && (
          <p className="text-gray-400 text-center col-span-full mt-4">
            No trainers match your search.
          </p>
        )}
      </div>
    </div>
  );
}
