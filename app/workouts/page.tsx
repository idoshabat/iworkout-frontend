'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import CreateWorkoutModal from "@/app/components/CreateWorkoutModal";
import { useUser } from "../lib/UserContext";
import { GET } from "@/app/lib/utils";
import Title from "../components/Title";

export default function WorkoutsPage() {
    const { user } = useUser();
    const [workouts, setWorkouts] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchWorkouts = async () => {
            const url = user.role === 'trainer' ? 
                `/users/trainers/workouts` : `/users/athletes/workouts`;
            const data = await GET(url);
            setWorkouts(data.data);
        };

        fetchWorkouts();
    }, [user]);

    if (!user) {
        return <h1 className="text-2xl text-center mt-8">Loading...</h1>;
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <Title>Workouts</Title>
            <Title size="sm">
                {user.role === "trainer" ? "My Workouts as a Coach" : "Workouts Assigned to Me"}
            </Title>

            {workouts && workouts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {workouts.map((workout) => (
                        <div key={workout.id} className="p-5 bg-gray-900 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                            <Link href={`/workouts/${workout.id}`} className="text-xl font-bold hover:text-blue-400">
                                {workout.name}
                            </Link>
                            <p className="mt-2 text-gray-300">{workout.description}</p>
                            <p className="mt-1 text-sm text-gray-400">
                                {workout.trainer === user.id ? "You are the trainer" : "You are not the trainer"}
                            </p>
                            <p className="mt-2 text-gray-300">
                                Drills:{" "}
                                {workout.drills && workout.drills.length > 0 ? (
                                    workout.drills.map((drill: any, i: number) => (
                                        <span key={drill}>
                                            
                                            <Link href={`/drills/${drill}?workoutId=${workout.id}`} className="text-blue-400 hover:underline">
                                                {drill}
                                            </Link>
                                            {i < workout.drills.length - 1 ? ", " : ""}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500">No drills</span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center mt-6">No workouts found.</p>
            )}

            {user.role === "trainer" && (
                <div className="mt-6 flex justify-center">
                    <CreateWorkoutModal userId={user.id} setWorkouts={setWorkouts} />
                </div>
            )}
        </div>
    );
}
