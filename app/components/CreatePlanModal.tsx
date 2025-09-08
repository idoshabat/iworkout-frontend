'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GET, POST } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type PlanFormData = {
    name: string;
    description?: string;
    price: number;
    workouts: number[];
};

export default function CreatePlanModal({ setPlans }: { setPlans: (plans: any[]) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const { register, handleSubmit, reset } = useForm<PlanFormData>();

    // Fetch workouts
    useEffect(() => {
        const fetchWorkouts = async () => {
            const res = await GET("/users/trainers/workouts");
            setWorkouts(res.data);
        };
        fetchWorkouts();
    }, []);

    const onSubmit = async (data: PlanFormData) => {
        try {
            setLoading(true);
            const res = await POST("/users/trainers/plans/", data);
            if (!res.ok) throw new Error("Failed to create plan");
            const plansRes = await GET("/users/trainers/plans");
            alert("Plan created successfully!");
            setPlans(plansRes.data);
            reset();
            setIsOpen(false);
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to create plan");
        } finally {
            setLoading(false);
        }
    };

    // Input animation variants
    const inputVariants = {
        initial: { opacity: 0.7, y: 10 },
        animate: { opacity: 1, y: 0 },
        focus: { scale: 1.02, boxShadow: "0 0 10px #facc15" }, // amber glow
    };

    return (
        <>
            {/* Neon Button */}
            <button
                className="neon-btn px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-black rounded-xl font-bold shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                + Create Plan
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900 text-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-700"
                        >
                            <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                                Create Plan
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Name */}
                                <motion.div
                                    variants={inputVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileFocus="focus"
                                    transition={{ type: "spring", stiffness: 120 }}
                                >
                                    <label className="block text-sm font-semibold mb-1">Plan Name</label>
                                    <input
                                        {...register("name", { required: true })}
                                        placeholder="Enter plan name"
                                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition shadow-md"
                                    />
                                </motion.div>

                                {/* Price */}
                                <motion.div
                                    variants={inputVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileFocus="focus"
                                    transition={{ type: "spring", stiffness: 120, delay: 0.05 }}
                                >
                                    <label className="block text-sm font-semibold mb-1">Price (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("price", { required: true })}
                                        placeholder="29.99"
                                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition shadow-md"
                                    />
                                </motion.div>

                                {/* Description */}
                                <motion.div
                                    variants={inputVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileFocus="focus"
                                    transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
                                >
                                    <label className="block text-sm font-semibold mb-1">Description</label>
                                    <textarea
                                        {...register("description")}
                                        placeholder="Describe the plan..."
                                        className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition shadow-md"
                                    />
                                </motion.div>

                                {/* Workouts */}
                                <motion.div
                                    variants={inputVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileFocus="focus"
                                    transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
                                >
                                    <label className="block text-sm font-semibold mb-1">Workouts</label>
                                    <div className="flex flex-col gap-2 max-h-44 overflow-y-auto border border-gray-700 rounded-xl p-3 bg-gray-800">
                                        {workouts.map((w) => (
                                            <motion.label
                                                key={w.id}
                                                className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition"
                                                whileHover={{ scale: 1.02, textShadow: "0 0 8px #facc15" }}
                                                transition={{ type: "spring", stiffness: 150 }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={w.id}
                                                    {...register("workouts")}
                                                    className="accent-amber-400"
                                                />
                                                {w.name}
                                            </motion.label>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <motion.button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px #facc15" }}
                                        className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition shadow-md"
                                    >
                                        Cancel
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px #facc15" }}
                                        className="px-5 py-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl font-bold shadow-lg transition transform disabled:opacity-50"
                                    >
                                        {loading ? "Saving..." : "Save Plan"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
