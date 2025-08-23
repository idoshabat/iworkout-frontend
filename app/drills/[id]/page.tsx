"use client";

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

    const [drill, setDrill] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!unwrappedParams.id) return;
        const fetchDrill = async () => {
            setLoading(true);
            const data = await GET(`/drills/${unwrappedParams.id}`);
            setDrill(data);
            setLoading(false);
        };
        fetchDrill();
    }, [unwrappedParams.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <h2 className="text-lg text-gray-400">Loading drill details...</h2>
            </div>
        );
    }

    if (!drill) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh]">
                <Title size="sm">Drill not found</Title>
                {workoutId && (
                    <Button onClick={() => window.history.back()}>
                        ← Back to Workout
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6">
            <Title>🏋️ Drill Details</Title>

            <div className="mt-6 w-full max-w-2xl bg-gray-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-white">{drill.name}</h2>
                <p className="text-gray-400 mt-3">{drill.description}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <p className="text-gray-500 text-sm">Sport</p>
                        <p className="text-white font-medium">{drill.sport}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <p className="text-gray-500 text-sm">Category</p>
                        <p className="text-white font-medium">{drill.category}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <p className="text-gray-500 text-sm">Trainer</p>
                        <p className="text-white font-medium">{drill.trainer}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl">
                        <p className="text-gray-500 text-sm">Difficulty</p>
                        <p className="text-white font-medium">{drill.difficulty}</p>
                    </div>
                </div>
            </div>

            {/* ✅ Show back button only if workoutId exists */}
            {workoutId && (
                <div className="mt-6">
                    <Button onClick={() => window.history.back()}>← Back to Workout</Button>
                </div>
            )}
        </div>
    );
}
