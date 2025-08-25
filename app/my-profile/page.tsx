'use client'
import { useUser } from '@/app/lib/UserContext';
import { useState, useEffect } from 'react';
import { GET } from '@/app/lib/utils';
import Title from '../components/Title';


export default function MyProfilePage() {
    const { user } = useUser();
    const [trainer, setTrainer] = useState<any>(null);
    const [athlete, setAthlete] = useState<any>(null);
    const [trainerPlans, setTrainerPlans] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchTrainer = async () => {
            // const data = await GET(`/users/trainers/${user.id}`);
            setTrainer(user.trainer_profile);
        };

        const fetchAthlete = async () => {
            // const data = await GET(`/users/athletes/${user.id}`);
            setAthlete(user.athlete_profile);
        };

        const fetchPlans = async () => {
            // const data = await GET(`/users/trainers/plans`);
            setTrainerPlans(user.trainer_profile?.plans || []);
        };

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
        { label: "Name", value: user.first_name + " " + user.last_name },
        { label: "Email", value: user.email },
        { label: "Date of birth", value: user.date_of_birth },
        { label: "Role", value: user.role },
        { label: "Gender", value: user.gender },
    ];

    return (
        <div className="flex flex-col items-center p-6">
            <Title size="lg">👤 Profile</Title>

            {/* Profile Card */}
            <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
                <div className="space-y-3">
                    {attributes.map((attr) => (
                        <div
                            key={attr.label}
                            className="flex justify-between border-b border-gray-700 pb-2"
                        >
                            <span className="text-gray-400">{attr.label}</span>
                            <span className="text-white">{attr.value || "-"}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trainer Section */}
            {trainer && (
                <>
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Trainer Dashboard</h2>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">My Athletes</h3>

                        {user.trainer_profile?.athletes?.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {user.trainer_profile.athletes.map((athlete: any) => (
                                    <div
                                        key={athlete.id}
                                        className="p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition"
                                    >
                                        <h3 className="text-white font-medium">
                                            {athlete.first_name} {athlete.last_name}
                                        </h3>
                                        <p className="text-gray-400 text-sm">{athlete.email}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">You don’t have any athletes yet.</p>
                        )}
                    </div>
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">My Plans</h2>
                        {trainerPlans && trainerPlans.length > 0 ? (
                            <div className="space-y-3">
                                {trainerPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="flex justify-between border-b border-gray-700 pb-2"
                                    >
                                        <span className="text-gray-400">{plan.name}</span>
                                        <span className="text-white">{plan.description || "-"}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">You don’t have any plans yet.</p>
                        )}
                    </div>
                </>
            )}

            {/* Athlete Section */}
            {athlete && (
                <>
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Athlete Dashboard</h2>
                        <h3 className="text-lg text-gray-300 mb-2">My Trainer</h3>
                    </div>
                </>
            )}

            {/* Athlete Section */}
            {athlete && (
                <>
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Athlete Dashboard</h2>
                        <h3 className="text-lg text-gray-300 mb-2">My Trainer</h3>
                        <p className="text-white">
                            {athlete.trainers?.length > 0
                                ? athlete.trainers.join(", ")
                                : "No trainer assigned"}
                        </p>
                    </div>

                </>
            )}
        </div>
    );
}
