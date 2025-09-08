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
        return <h1 className="text-2xl text-center mt-24 text-gray-400">There is no logged-in user</h1>;
    }

    if (!workout) {
        return <h1 className="text-2xl text-center mt-24 text-gray-400">Can't find workout</h1>;
    }

    return (
        <div className="pt-24 px-4 sm:px-6 md:px-12 pb-12 flex flex-col items-center gap-6 bg-gray-950 min-h-screen">
            {/* Header */}
            <Title size="lg" >
                Workout Details
            </Title>
            <Title size="md" >{workout.name}</Title>
            <p className="text-gray-400 text-center max-w-2xl">{workout.description}</p>

            {/* Trainer Actions */} 
            {trainer && (
                <div className="flex flex-col items-center gap-3 my-4">
                    <Button onClick={() => setShowModal(true)}>Add Athlete to Workout</Button>
                    <h2 className="text-white text-lg text-center">
                        Users with access:{" "}
                        {workout.athletes && workout.athletes.length > 0
                            ? workout.athletes.join(", ")
                            : "No users yet"}
                    </h2>
                </div>
            )}

            {/* Drills Section */}
            <h2 className="text-xl font-semibold mt-6 text-white">Drills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-2">
                {drills && drills.length > 0 ? (
                    drills.map((drill) => (
                        <Link
                            key={drill.id}
                            href={`/drills/${drill.id}?workoutId=${workout.id}`}
                            className="p-5 bg-gray-900/80 backdrop-blur-sm text-white rounded-2xl shadow-lg hover:shadow-amber-500/40 hover:scale-105 transition-transform duration-200 text-center font-medium"
                        >
                            {drill.name}
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full mt-2">No drills added yet</p>
                )}
            </div>

            {/* Modal */}
            {trainer && showModal && (
                <AddAthleteToWorkoutModal
                    user={user}
                    trainer={trainer}
                    workout={workout}
                    onClose={() => setShowModal(false)}
                    onUpdateWorkout={setWorkout}
                />
            )}

            {/* Back Button */}
            <div className="mt-8">
                <BackButton />
            </div>
        </div>
    );
}
