'use client'
import { useUser } from '@/app/lib/UserContext';
import { useState, useEffect } from 'react';
import { GET } from '@/app/lib/utils';
import Title from '../components/Title';
import Link from 'next/link';

export default function MyProfilePage() {
  const { user } = useUser();
  const [trainer, setTrainer] = useState<any>(null);
  const [athlete, setAthlete] = useState<any>(null);
  const [trainerPlans, setTrainerPlans] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchTrainer = async () => setTrainer(user.trainer_profile);
    const fetchAthlete = async () => setAthlete(user.athlete_profile);
    const fetchPlans = async () => setTrainerPlans(user.trainer_profile?.plans || []);

    if (user.role === 'athlete') fetchAthlete();
    else if (user.role === 'trainer') {
      fetchPlans();
      fetchTrainer();
    }
  }, [user]);

  if (!user) {
    return <h1 className="text-2xl text-center mt-10 text-gray-400">Loading...</h1>;
  }

  const attributes = [
    { label: "ID", value: user.id },
    { label: "Name", value: `${user.first_name} ${user.last_name}` },
    { label: "Email", value: user.email },
    { label: "Date of birth", value: user.date_of_birth },
    { label: "Role", value: user.role },
    { label: "Gender", value: user.gender },
  ];

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-[#0e0b22] to-[#050317] text-white">
      <Title size="lg" subtitle="High-tech personal dashboard">👤 Profile</Title>

      {/* Profile Card */}
      <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-3xl shadow-lg p-8 mt-6 hover:shadow-[#6e00ff]/50 transition duration-500">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-6">
          User Information
        </h2>
        <div className="space-y-4">
          {attributes.map(attr => (
            <div key={attr.label} className="flex justify-between border-b border-[#6e00ff]/30 pb-3">
              <span className="text-[#aaa]">{attr.label}</span>
              <span className="font-medium">{attr.value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Section */}
      {trainer && (
        <>
          {/* Athletes */}
          <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#ff00f7]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#00fff7]/50 transition duration-500">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00f7] to-[#00fff7] mb-4">🏋️ My Athletes</h2>
            {user.trainer_profile?.athletes?.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {user.trainer_profile.athletes.map((athlete: any) => (
                  <div key={athlete.id} className="p-5 rounded-2xl bg-[#1c1a33]/70 border border-[#ff00f7]/40 shadow-lg hover:shadow-[#ff00f7]/60 transition transform hover:-translate-y-1 duration-300 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6e00ff] to-[#00fff7] flex items-center justify-center text-xl font-bold text-white shadow-md mb-3">
                      {athlete.first_name[0]}{athlete.last_name[0]}
                    </div>
                    <h3 className="text-white font-semibold">{athlete.first_name} {athlete.last_name}</h3>
                    <p className="text-[#aaa] text-sm">{athlete.email}</p>
                    <Link href={`/profile/?email=${athlete.email}`} className="mt-2 text-[#00fff7] hover:underline">
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888]">You don’t have any athletes yet.</p>
            )}
          </div>

          {/* Plans */}
          <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#00fff7]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#6e00ff]/50 transition duration-500">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-4">📋 My Plans</h2>
            {trainerPlans.length > 0 ? (
              <div className="space-y-4">
                {trainerPlans.map(plan => (
                  <div key={plan.id} className="flex justify-between items-center border-b border-[#6e00ff]/30 pb-3">
                    <span className="text-[#ff00f7] font-semibold">{plan.name}</span>
                    <span className="text-[#aaa]">{plan.description || "-"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888]">You don’t have any plans yet.</p>
            )}
          </div>
        </>
      )}

      {/* Athlete Section */}
      {athlete && (
        <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#00fff7]/50 transition duration-500">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-4">🎯 Athlete Dashboard</h2>
          <h3 className="text-lg text-[#aaa] mb-4">My Trainers</h3>
          {athlete.trainers?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {athlete.trainers.map((t: any) => (
                <div key={t.id} className="bg-gradient-to-br from-[#6e00ff]/40 to-[#00fff7]/30 rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6e00ff] to-[#00fff7] flex items-center justify-center text-2xl text-white font-bold mb-3 shadow-lg">
                    {t.first_name[0]}{t.last_name[0]}
                  </div>
                  <div className="text-white font-semibold text-lg">{t.first_name} {t.last_name}</div>
                  <div className="text-[#aaa] text-sm">{t.email}</div>
                  <Link href={`/profile/?email=${t.email}`} className="text-[#00fff7] hover:underline mt-2">
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#888]">No trainer assigned</p>
          )}
        </div>
      )}
    </div>
  );
}
