'use client';
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { GET } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";
import AddAthleteToWorkoutModal from "@/app/components/AddAthleteToWorkoutModal";
import Button from "@/app/components/Button";
import Title from "@/app/components/Title";
import BackButton from "@/app/components/BackButton";

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useUser();
    const unwrappedParams = use(params);
    const [workout, setWorkout] = useState<any>(null);
    const [drills, setDrills] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const trainer = user?.role === 'trainer' ? user.trainer_profile : null;
    const athlete = user?.role === 'athlete' ? user.athlete_profile : null;

    useEffect(() => {
        const fetchWorkout = async () => {
            const res = await GET(`/workouts/${unwrappedParams.id}`);
            setWorkout(res.data);
        };
        fetchWorkout();
    }, [unwrappedParams.id]);

    useEffect(() => {
        if (!workout?.drills || workout.drills.length === 0) return;

        const fetchDrills = async () => {
            const url = `/drills/get-few-drills?ids=${workout.drills.join(",")}`;
            const data = await GET(url);
            setDrills(data.data);
        };
        fetchDrills();
    }, [workout]);

    if (!user) {
        return <h1 className="text-2xl text-center mt-8">There is no logged-in user</h1>;
    }

    if (!workout) {
        return <h1 className="text-2xl text-center mt-8">Can't find workout</h1>;
    }

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <Title>Workout Details</Title>
            <Title size="sm">{workout.name}</Title>
            <p className="text-gray-300 text-center">{workout.description}</p>

            {trainer && (
                <div className="flex flex-col items-center gap-2 my-4">
                    <Button onClick={() => setShowModal(true)}>Add Athlete to Workout</Button>
                    <h2 className="text-lg font-medium mt-2">
                        Users with access:{" "}
                        {workout.athletes && workout.athletes.length > 0 ? workout.athletes.join(", ") : "No users yet"}
                    </h2>
                </div>
            )}

            <h2 className="text-xl font-semibold mt-4">Drills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mt-2">
                {drills && drills.length > 0 ? (
                    drills.map((drill) => (
                        <Link
                            key={drill.id}
                            href={`/drills/${drill.id}?workoutId=${workout.id}`}
                            className="p-4 bg-gray-900 text-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 text-center"
                        >
                            {drill.name}
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full">No drills added yet</p>
                )}
            </div>

            {trainer && showModal && (
                <AddAthleteToWorkoutModal
                user={user}
                trainer={trainer}
                workout={workout}
                onClose={() => setShowModal(false)}
                onUpdateWorkout={setWorkout}
                />
            )}
            
            <BackButton />
        </div>
    );
}
