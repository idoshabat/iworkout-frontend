"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GET, POST } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./ProgressBar";
import Toast from "./Toast";

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
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0); // 1 = next, -1 = prev
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const { register, handleSubmit, reset, getValues } = useForm<PlanFormData>({
        mode: "onChange",
        defaultValues: { name: "", description: "", price: 0, workouts: [] },
    });

    useEffect(() => {
        const fetchWorkouts = async () => {
            const res = await GET("/users/trainers/workouts");
            setWorkouts(res.data);
        };
        fetchWorkouts();
    }, []);

    const steps = [
        { label: "Plan Name", field: "name", placeholder: "Enter plan name", type: "text" },
        { label: "Price (USD)", field: "price", placeholder: "29.99", type: "number" },
        { label: "Description", field: "description", placeholder: "Describe the plan...", type: "textarea" },
        { label: "Select Workouts", field: "workouts", type: "checkboxes" },
    ];

    const onSubmit = async (data: PlanFormData) => {
        const payload = { ...data, workouts: (data.workouts || []).map(Number) };

        try {
            setLoading(true);
            const res = await POST("/users/trainers/plans/", payload);
            if (!res.ok) throw new Error("Failed to create plan");

            const plansRes = await GET("/users/trainers/plans");
            setPlans(plansRes.data);

            setToast({ message: "✅ Plan created successfully!", type: "success" });
        } catch (err) {
            console.error(err);
            setToast({ message: "❌ Failed to create plan", type: "error" });
        } finally {
            setLoading(false);
            setIsOpen(false);
            setTimeout(() => {
                reset({ name: "", description: "", price: 0, workouts: [] });
                setStep(0);
                setDirection(0);
            }, 200);
        }
    };

    const nextStep = () => {
        const field = steps[step].field as keyof PlanFormData;
        const value = getValues(field);

        if ((field === "workouts" && (!value || (value as any[]).length === 0)) || (!value && field !== "description")) {
            setToast({ message: "⚠️ Please fill this field before continuing", type: "error" });
            return;
        }

        setDirection(1);
        setStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setDirection(-1);
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, position: "absolute" }),
        center: { x: 0, opacity: 1, position: "relative" },
        exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0, position: "absolute" }),
    };

    return (
        <>
            <button
                className="neon-btn px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 text-black rounded-xl font-bold shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                onClick={() => {
                    reset({ name: "", description: "", price: 0, workouts: [] });
                    setStep(0);
                    setDirection(0);
                    setToast(null);
                    setIsOpen(true);
                }}
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
                            className="bg-gray-900 text-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-700 overflow-hidden relative"
                        >
                            <h2 className="text-2xl font-extrabold text-center mb-4 bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                                Create Plan
                            </h2>

                            <ProgressBar step={step} total={steps.length} />

                            <form
                                onSubmit={(e) => e.preventDefault()} // מבטל כל submit רגיל
                                className="flex flex-col items-center justify-center space-y-6 relative h-[320px]"
                            >
                                <AnimatePresence custom={direction} mode="wait">
                                    {step < steps.length && (
                                        <motion.div
                                            key={step}
                                            custom={direction}
                                            variants={variants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.4 }}
                                            className="w-full flex flex-col gap-4 absolute top-0 left-0"
                                        >
                                            <span className="text-lg font-bold text-amber-400">{steps[step].label}</span>

                                            {steps[step].type === "textarea" ? (
                                                <textarea
                                                    {...register(steps[step].field as keyof PlanFormData)}
                                                    placeholder={steps[step].placeholder}
                                                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition shadow-md"
                                                />
                                            ) : steps[step].type === "checkboxes" ? (
                                                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-700 rounded-xl p-3 bg-gray-800">
                                                    {workouts.map((w) => (
                                                        <label
                                                            key={w.id}
                                                            className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={w.id}
                                                                {...register("workouts")}
                                                                className="accent-amber-400"
                                                            />
                                                            {w.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <input
                                                    type={steps[step].type}
                                                    {...register(steps[step].field as keyof PlanFormData)}
                                                    placeholder={steps[step].placeholder}
                                                    className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 transition shadow-md"
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* כפתורי ניווט */}
                                <div className="flex justify-between w-full absolute bottom-0 left-0 p-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={step === 0}
                                        className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition disabled:opacity-50"
                                    >
                                        Back
                                    </button>

                                    {step < steps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl font-bold shadow-lg hover:shadow-2xl transition transform hover:scale-105"
                                        >
                                            Next
                                        </button>
                                    ) : (
                                        <button
                                            type="button" // שים לב - לא submit
                                            onClick={handleSubmit(onSubmit)} // מפעיל את ההגשה רק כאן
                                            disabled={loading}
                                            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-xl font-bold shadow-lg hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-50"
                                        >
                                            {loading ? "Saving..." : "Create Plan"}
                                        </button>
                                    )}
                                </div>
                            </form>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast
                message={toast?.message || ""}
                type={toast?.type || "success"}
                isVisible={!!toast}
                onClose={() => setToast(null)}
            />
        </>
    );
}
