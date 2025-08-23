'use client';

import { useUser, useTrainer } from '@/app/lib/UserContext';
import Title from '../components/Title';

export default function MyAthletesPage() {
  const { user } = useUser();

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

  return (
    <div className="p-6">
      <Title size="lg">👟 My Athletes</Title>

      {!user.trainer_profile.athletes || user.trainer_profile.athletes.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">
          You don’t have any athletes yet. Send invitations to get started!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {user.trainer_profile.athletes.map((athlete: any) => (
            <div
              key={athlete.id}
              className="p-6 bg-gray-900 hover:bg-gray-800 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold text-white">
                {athlete.first_name} {athlete.last_name}
              </h3>
              <p className="text-gray-400 mt-1">{athlete.email}</p>
              {athlete.age && (
                <p className="text-gray-400 text-sm mt-1">Age: {athlete.age}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
