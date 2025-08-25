"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GET, POST } from "../lib/utils";

type PlanFormData = {
    name: string;
    description?: string;
    price: number;
    workouts: number[]; // Array of selected workout IDs
};

export default function CreatePlanModal({ setPlans }: { setPlans: (plans: any[]) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const { register, handleSubmit, reset } = useForm<PlanFormData>();

    // Fetch all workouts for the trainer to select
    useEffect(() => {
        const fetchWorkouts = async () => {
            const data = await GET("/users/trainers/workouts");
            setWorkouts(data);
        };
        fetchWorkouts();
    }, []);

    const onSubmit = async (data: PlanFormData) => {
        try {
            setLoading(true);
            const res = await POST("/users/trainers/plans/", data);

            if (!res.ok) throw new Error("Failed to create plan");

            const plans = await GET("/users/trainers/plans");
            alert("Plan created successfully!");
            setPlans(plans);
            reset();
            setIsOpen(false);
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to create plan");
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
                + Create Plan
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Create Plan</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    {...register("name", { required: true })}
                                    placeholder="Enter plan name"
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium">Price (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", { required: true })}
                                    placeholder="e.g., 29.99"
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    {...register("description")}
                                    placeholder="Describe the plan..."
                                    className="w-full border px-3 py-2 rounded-lg"
                                />
                            </div>

                            {/* Select Workouts */}
                            <div>
                                <label className="block text-sm font-medium">Workouts</label>
                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                                    {workouts.map((w) => (
                                        <label key={w.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                value={w.id}
                                                {...register("workouts")}
                                            />
                                            {w.name}
                                        </label>
                                    ))}
                                </div>
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
