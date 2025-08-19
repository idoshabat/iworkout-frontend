"use client";

import { useState , useEffect } from "react";
import { useForm } from "react-hook-form";
import {GET, POST } from "../lib/utils";

type WorkoutFormData = {
    sport: string;
    name: string;
    description: string;
    category: string;
    trainer?: string;
};

export default function CreateWorkoutModal({ userId, setWorkouts }: { userId: string; setWorkouts: (workouts: any[]) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [drills, setDrills] = useState<any[]>([]);
    const { register, handleSubmit, reset, watch } = useForm<WorkoutFormData>();

    useEffect(() => {
            const fetchDrills = async () => {
                const data = await GET("/drills");
                setDrills(data);
            };
            fetchDrills();
        }, []);

    const onSubmit = async (data: WorkoutFormData) => {
        try {
            setLoading(true);
            data = { ...data, "trainer": userId };

            const res = await POST("/workouts/", data);
            const workouts = await GET("/workouts");
            if(!res.ok) throw new Error("Failed to create workout");
            alert("Workout created successfully!");
            setWorkouts(workouts);
            reset();
            setIsOpen(false);
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to create workout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Button to open modal */}
            <button
                className="px-4 py-2 bg-white text-black rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() => setIsOpen(true)}
            >
                + Create Workout
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Create Drill</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    {...register("name", { required: true })}
                                    placeholder="Enter drill name"
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>


                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    {...register("description")}
                                    placeholder="Describe the drill..."
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
