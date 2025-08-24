'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from '../components/Title';
import { POST } from '../lib/utils';
import { useState , useEffect } from 'react';

export default function MyAthletesPage() {
  const { user } = useUser();
  const [athletes, setAthletes] = useState<any[]>(user?.trainer_profile.athletes || []);

  useEffect(() => {
    if (user) {
      setAthletes(user.trainer_profile.athletes || []);
    }
  }, [user]);


  if (!user) {
    return (
      <div className="p-6 text-center">
        <Title>Please login to view this page</Title>
      </div>
    );
  }

  if (user.role !== 'trainer') {
    return (
      <div className="p-6 text-center">
        <Title size="md">Only trainers can view this page</Title>
      </div>
    );
  }

  const removeAthlete = async (id: string) => {
    try {
      await POST(`/users/trainers/remove-athlete/${id}/`, {});
      // Remove athlete from local state
      setAthletes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to remove athlete.');
    }
  };

  return (
    <div className="p-6">
      <Title size="lg">👟 My Athletes</Title>

      <div className="flex items-center justify-center mx-auto gap-4 mt-6 mb-4">
        <a
          href="/find-athlete"
          className="inline-block px-6 py-2 rounded-lg bg-blue-300 hover:bg-blue-400 text-white font-semibold shadow transition"
        >
          Find Athlete
        </a>
        <a
          href="/invitations"
          className="inline-block px-6 py-2 rounded-lg bg-blue-300 hover:bg-blue-400 text-white font-semibold shadow transition"
        >
          Invitations
        </a>
      </div>

      {athletes.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">
          You don’t have any athletes yet. Send invitations to get started!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {athletes.map((athlete: any) => (
            <div
              key={athlete.id}
              className="relative p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
            >
              <button
                onClick={() => removeAthlete(athlete.id)}
                className="absolute top-2 cursor-pointer right-2 text-gray-400 hover:text-gray-200"
              >
                ❌
              </button>
              <h3 className="text-xl font-semibold text-white">
                {athlete.first_name} {athlete.last_name}
              </h3>
              <p className="text-gray-400 mt-1">{athlete.email}</p>
              <p className="text-gray-400 mt-1">{athlete.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
