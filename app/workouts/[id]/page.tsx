'use client'
import { useState, useEffect, use } from "react";
import { GET } from "@/app/lib/utils";

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params); // unwrap the promise
    const [workout, setWorkout] = useState<any>(null);
    const [drills, setDrills] = useState<any[]>([]);

    // Fetch workout first
    useEffect(() => {
        const fetchWorkout = async () => {
            const data = await GET(`/workouts/${unwrappedParams.id}`);
            setWorkout(data); 
        };
        fetchWorkout();
    }, [unwrappedParams.id]);

    // Fetch drills AFTER workout is loaded
    useEffect(() => {
        if (!workout?.drills || workout.drills.length === 0) return;

        const fetchDrills = async () => {
            const url = `/drills/get-few-drills?ids=${workout.drills.map((drill: any) => drill).join(",")}`;
            const data = await GET(url);
            setDrills(data);
        };
        fetchDrills();
    }, [workout]); // depends on workout being set

    if (!workout) {
        return <h1 className="text-2xl">Loading...</h1>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            <p>{workout.description}</p>
            <h2 className="text-xl font-bold">Drills</h2>
            <ul>
                {drills.map((drill) => (
                    <div key={drill.id} className="border rounded p-2 my-2">
                        <li>{drill.name}</li>
                    </div>
                ))}
            </ul>
        </div>
    );
}
