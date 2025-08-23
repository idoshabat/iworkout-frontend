'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/app/lib/UserContext';
import Title from '../components/Title';

interface Athlete {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
}

export default function MyAthletesPage() {
  const { user } = useUser();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user?.role === 'trainer') {
//       const fetchAthletes = async () => {
//         try {
//           const res = await fetch('/users/my-athletes', { credentials: 'include' });
//           if (res.ok) {
//             const data = await res.json();
//             setAthletes(data);
//           } else {
//             console.error('Failed to fetch athletes');
//           }
//         } catch (error) {
//           console.error('Error fetching athletes:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchAthletes();
//     } else {
//       setLoading(false);
//     }
//   }, [user]);

//   if (!user) {
//     return (
//       <div className="p-6 text-center">
//         <Title>Please login to view this page</Title>
//       </div>
//     );
//   }

//   if (user.role !== 'trainer') {
//     return (
//       <div className="p-6 text-center">
//         <Title size="md">Only trainers can view this page</Title>
//       </div>
//     );
//   }

  return (
    <div className="p-6">
      <Title size="lg">👟 My Athletes</Title>

      {/* {loading ? (
        <p className="text-gray-400 text-center mt-6">Loading athletes...</p>
      ) : athletes.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">
          You don’t have any athletes yet. Send invitations to get started!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {athletes.map((athlete) => (
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
      )} */}
    </div>
  );
}
