'use client';

import { useUser } from "@/app/lib/UserContext";
import { useState, useEffect, use } from "react";
import { GET } from "@/app/lib/utils";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";
import Title from "@/app/components/Title";


export default function DrillPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useUser();
    const unwrappedParams = use(params); // ✅ unwrap params
    const searchParams = useSearchParams();
    const workoutId = searchParams.get("workoutId"); // get workoutId from query

    const [athlete, setAthlete] = useState(null);
    const [trainer, setTrainer] = useState(null);
    const [drill, setDrill] = useState<any>(null);

    useEffect(() => {
        if (!user) return;
        if (user.role === 'athlete') {
            GET(`/users/athletes/${user.id}`).then(setAthlete);
        } else if (user.role === 'trainer') {
            GET(`/users/trainers/${user.id}`).then(setTrainer);
        }
    }, [user]);

    useEffect(() => {
        if (!unwrappedParams.id) return;
        GET(`/drills/${unwrappedParams.id}`).then(setDrill);
    }, [unwrappedParams.id]);

    return (
        <div className="flex flex-col items-center gap-2">
            <Title>Drill Details</Title>
            {drill && (
                <div className="flex flex-col items-start gap-2">
                    <Title size="sm">{drill.name}</Title>
                    <h2 className="text-xl">Description - {drill.description}</h2>
                    <h2 className="text-xl">Sport - {drill.sport}</h2>
                    <h2 className="text-xl">Category - {drill.category}</h2>
                    <h2 className="text-xl">Trainer - {drill.trainer}</h2>
                    <h2 className="text-xl">Difficulty - {drill.difficulty}</h2>
                </div>
            )}

            {/* ✅ Show back button only if workoutId exists */}
            {workoutId && (
                <Button onClick={() => window.history.back()}>← Back to Workout</Button>
            )}
        </div>
    );
}
