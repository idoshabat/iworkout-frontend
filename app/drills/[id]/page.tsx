'use client';

import { useUser } from "@/app/lib/UserContext";
import { useState, useEffect, use } from "react";
import { GET } from "@/app/lib/utils";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";
import Title from "@/app/components/Title";
import BackButton from "@/app/components/BackButton";

export default function DrillPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useUser();
    const unwrappedParams = use(params);
    const searchParams = useSearchParams();
    const workoutId = searchParams.get("workoutId");

    const [drill, setDrill] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!unwrappedParams.id) return;
        const fetchDrill = async () => {
            setLoading(true);
            const res = await GET(`/drills/${unwrappedParams.id}`);
            setDrill(res.data);
            setLoading(false);
        };
        fetchDrill();
    }, [unwrappedParams.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen pt-24">
                <h2 className="text-lg text-gray-400 animate-pulse">Loading drill details...</h2>
            </div>
        );
    }

    if (!drill) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen pt-24">
                <Title size="md" >Drill not found</Title>
                {workoutId && (
                    <Button onClick={() => window.history.back()} >
                        ← Back to Workout
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 sm:px-6 md:px-12 pb-12 flex flex-col items-center bg-gray-950 min-h-screen gap-6">
            {/* Header */}
            <Title size="lg" >
                🏋️ Drill Details
            </Title>
            <h2 className="text-3xl font-bold text-white">{drill.name}</h2>
            <p className="text-gray-400 text-center max-w-2xl">{drill.description}</p>

            {/* Drill Info Card */}
            <div className="w-full max-w-3xl mt-6 bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800 rounded-xl shadow hover:shadow-amber-500/30 transition">
                        <p className="text-gray-400 text-sm">Sport</p>
                        <p className="text-white font-medium">{drill.sport}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl shadow hover:shadow-amber-500/30 transition">
                        <p className="text-gray-400 text-sm">Category</p>
                        <p className="text-white font-medium">{drill.category}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl shadow hover:shadow-amber-500/30 transition">
                        <p className="text-gray-400 text-sm">Trainer</p>
                        <p className="text-white font-medium">{drill.trainer}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl shadow hover:shadow-amber-500/30 transition">
                        <p className="text-gray-400 text-sm">Difficulty</p>
                        <p className="text-white font-medium">{drill.difficulty}</p>
                    </div>
                </div>

                {/* Video */}
                {drill.video_url ? (
                    <video
                        controls
                        className="w-full mt-6 rounded-2xl shadow-lg border border-gray-700"
                    >
                        <source src={drill.video_url} />
                    </video>
                ) : (
                    <p className="text-gray-500 text-center mt-4">No video available</p>
                )}
            </div>

            {/* Back Button */}
            <div className="mt-8">
                <BackButton text={workoutId ? "Back to Workout" : "Back"} />
            </div>
        </div>
    );
}
