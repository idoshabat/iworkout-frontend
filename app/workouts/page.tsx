'use client'
import { useState, useEffect } from "react";
import CreateWorkoutModal from "@/app/components/CreateWorkoutModal";
import { useUser } from "../lib/UserContext";
import {GET} from "@/app/lib/utils";

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<any[]>([]);
    useEffect(() => {
            const fetchWorkouts = async () => {
                const data = await GET("/workouts");
                setWorkouts(data);
            };
            fetchWorkouts();
        }, []);

    const { user } = useUser();
    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }
    return (
        <div>
            <h1>Workouts</h1>
            {/* Add your workout components here */}
            <div className="flex flex-col gap-4">
                {workouts.map((workout) => (
                    <div key={workout.id} className="p-4 border rounded-lg">
                        <h3 className="text-xl font-bold">{workout.name}</h3>
                        <p>{workout.description}</p>
                        <p>{workout.trainer === user.id ? "You are the trainer" : "You are not the trainer"}</p>
                    </div>
                ))}
            </div>
            <CreateWorkoutModal userId={user.id} setWorkouts={setWorkouts} />
        </div>
    );
}
