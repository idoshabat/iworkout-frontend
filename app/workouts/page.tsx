'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import CreateWorkoutModal from "@/app/components/CreateWorkoutModal";
import { useUser } from "../lib/UserContext";
import { GET } from "@/app/lib/utils";

export default function WorkoutsPage() {
    const { user } = useUser();   // 👈 תביא את ה־user קודם
    const [workouts, setWorkouts] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;   // 👈 תבדוק פה במקום לעשות return למעלה
        if (user.role === 'trainer') {
            const fetchWorkouts = async () => {
                const data = await GET(`/users/trainers/workouts`);
                setWorkouts(data);
            };
            fetchWorkouts();
        }
        if (user.role === 'athlete') {
            const fetchWorkouts = async () => {
                const data = await GET(`/users/athletes/workouts`);
                setWorkouts(data);
            };
            fetchWorkouts();
        }

    }, [user]);

    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }

    return (
        <div>
            <h1>Workouts</h1>
            <div className="flex flex-col gap-4">
            {workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
                    <div key={workout.id} className="p-4 border rounded-lg">
                        <Link href={`/workouts/${workout.id}`} className="text-xl font-bold">
                            {workout.name}
                        </Link>
                        <p>{workout.description}</p>
                        <p>{workout.trainer === user.id ? "You are the trainer" : "You are not the trainer"}</p>
                        <p>Drills: {workout.drills.map((drill: any) => drill).join(" , ")}</p>
                    </div> 
                ))
            ) : (
                <p>No workouts found.</p>
            )}
            </div>
            <CreateWorkoutModal userId={user.id} setWorkouts={setWorkouts} />
        </div>
    );
}
