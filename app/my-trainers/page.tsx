'use client';

import { useUser } from '@/app/lib/UserContext';
import Title from '../components/Title';
import { useEffect, useState } from 'react';

export default function MyTrainersPage() {
  const { user } = useUser();
  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role === 'athlete') {
      setTrainers(user.athlete_profile?.trainers || []);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <Title>Please login to view this page</Title>
      </div>
    );
  }

  if (user.role !== 'athlete') {
    return (
      <div className="p-6 text-center">
        <Title size="md">Only athletes can view this page</Title>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="p-6 text-center">
        <Title size="md">You don’t have a trainer yet</Title>
        <p className="text-gray-400 mt-2">
          Ask your trainer to add you or check your invitations.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Title size="lg">🏋️ My Trainers</Title>

      <div className="flex items-center justify-center mx-auto gap-4 mt-6 mb-4">
        <a
          href="/find-trainer"
          className="inline-block px-6 py-2 rounded-lg bg-blue-300 hover:bg-blue-400 text-white font-semibold shadow transition"
        >
          Find Trainer
        </a>
        <a
          href="/invitations"
          className="inline-block px-6 py-2 rounded-lg bg-blue-300 hover:bg-blue-400 text-white font-semibold shadow transition"
        >
          Invitations
        </a>
      </div>

      <div className="mt-6 p-6 bg-gray-900 rounded-xl shadow-lg">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="mb-4">
            <h2 className="text-2xl font-bold text-white">{trainer.first_name} {trainer.last_name}</h2>
            <p className="text-gray-400 mt-2">Email: {trainer.email}</p>
            <a
                href={`/profile?email=${trainer.email}`}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                View Profile
              </a>            
          </div>
        ))}
        {trainers[0].bio && <p className="text-gray-400 mt-1">{trainers[0].bio}</p>}
      </div>

      {/* Optional: button to view trainer drills */}
      {/* <div className="mt-6 text-center">
        <a
          href="/trainer-drills"
          className="px-6 py-2 rounded-lg bg-blue-300 hover:bg-blue-400 text-white font-semibold shadow transition"
        >
          View Trainer's Drills
        </a>
      </div> */}
    </div>
  );
}
