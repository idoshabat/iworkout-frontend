'use client'
import { useState, useEffect, use } from "react";
import { GET } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";
import AddAthleteToWorkoutModal from "@/app/components/AddAthleteToWorkoutModal";
import Button from "@/app/components/Button";

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useUser();
    const unwrappedParams = use(params); // ✅ unwrap params
    const [workout, setWorkout] = useState<any>(null);
    const [drills, setDrills] = useState<any[]>([]);
    const [trainer, setTrainer] = useState<any>(null);
    const [athlete, setAthlete] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    
    useEffect(() => {
        if (!user) return; // only fetch if user exists
        if (user.role === 'athlete') {
            GET(`/users/athletes/${user.id}`).then(setAthlete);
        } else if (user.role === 'trainer') {
            GET(`/users/trainers/${user.id}`).then(setTrainer);
        }
    }, [user]);
    
    useEffect(() => {
        const fetchWorkout = async () => {
            const data = await GET(`/workouts/${unwrappedParams.id}`);
            setWorkout(data); 
        };
        fetchWorkout();
    }, [unwrappedParams.id]);

    useEffect(() => {
        if (!workout?.drills || workout.drills.length === 0) return;

        const fetchDrills = async () => {
            const url = `/drills/get-few-drills?ids=${workout.drills.join(",")}`;
            const data = await GET(url);
            setDrills(data);
        };
        fetchDrills();
    }, [workout]);
    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }

    if (!workout) {
        return <h1 className="text-2xl">Loading...</h1>;
    }
    
    return (
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p>{workout.description}</p>
            <h2 className="text-xl font-bold">Drills</h2>
            <h2 className="text-lg">
                Users with access - {workout.athletes.length > 0 ? workout.athletes.join(", ") : "No users yet"}
            </h2>
            <Button onClick={() => setShowModal(true)}>Add User To Workout</Button>
            <div className="flex flex-col gap-4 w-full items-center">
                {drills.map((drill) => (
                    <div key={drill.id} className="w-1/4 min-h-[10vh] border rounded p-2 my-2 flex flex-col items-center justify-center text-center">
                        <h2>{drill.name}</h2>
                    </div>
                ))}
            </div>

            {showModal && (
                <AddAthleteToWorkoutModal
                user={user}
                trainer={trainer}
                workout={workout}
                onClose={() => setShowModal(false)}
                onUpdateWorkout={setWorkout} // update state directly
            />
            )}
        </div>
    );
}
