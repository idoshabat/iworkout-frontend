
'use client'
import { useUser } from '@/app/lib/UserContext';
import { useState, useEffect } from 'react';
import { GET } from '@/app/lib/utils';

export default function ProfilePage() {
    const { user, setUser } = useUser();
    const [trainer, setTrainer] = useState<any>(null);
    const [athlete, setAthlete] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchTrainer = async () => {
            console.log(`/users/trainers/${user.id}`);
            const data = await GET(`/users/trainers/${user.id}`);
            setTrainer(data);
        };

        const fetchAthlete = async () => {
            const data = await GET(`/users/athletes/${user.id}`);
            setAthlete(data);
        };
        if (user.role === 'athlete') {
            fetchAthlete();
            console.log("ATHLETE", athlete);
        }
        else if (user.role === 'trainer') {
            fetchTrainer();
            console.log('TRAINER', trainer);
        }
    }, [user]);

    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }

    const attributes = [
        { label: "Name", value: user.first_name + " " + user.last_name },
        { label: "Email", value: user.email },
        { label: "Date of birth", value: user.date_of_birth },
        { label: "Role", value: user.role },
        { label: "Gender", value: user.gender },
    ];

    return (
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-4xl">Profile</h1>
            {/* Profile details go here */}
            {user ? (
                <div className='flex flex-col gap-4 mt-8 justify-start'>
                    {attributes.map((attr) => (
                        <div className="flex flex-row" key={attr.label}>
                            <h2>{attr.label} : </h2>
                            <h2>{attr.value}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>No user information available</h1>
            )}

            {trainer && (
                <div className="mt-8">
                    <h2 className="text-2xl">Trainer Actions</h2>
                    {/* Add trainer-specific actions here */}
                    My athletes - {trainer.athletes ? trainer.athletes.join(", ") : "No athletes yet"}
                </div>
            )}

            {athlete.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl">Athlete Actions</h2>
                    {/* Add athlete-specific actions here */}
                </div>
            )}
        </div>
    );
}
