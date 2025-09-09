'use client';

import { useState } from "react";
import { POST } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Title from "../components/Title";
import ProgressBar from "../components/ProgressBar"; // <-- import the progress bar

type Role = "athlete" | "trainer";

export default function SignupPage() {
    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: "",
        gender: "",
        date_of_birth: "",
        role: "",
    });

    const fields: { key: keyof typeof formData; label: string; type: string }[] = [
        { key: "first_name", label: "Enter your First Name", type: "text" },
        { key: "last_name", label: "Enter your Last Name", type: "text" },
        { key: "email", label: "Enter your Email", type: "email" },
        { key: "password", label: "Create a Password", type: "password" },
        { key: "password2", label: "Confirm Password", type: "password" },
        { key: "gender", label: "Select your Gender", type: "select" },
        { key: "date_of_birth", label: "Enter your Date of Birth", type: "date" },
    ];

    async function handleSubmit() {
        setLoading(true);
        const dataToSend = { ...formData, role };
        try {
            const response = await POST("/users/register/", dataToSend);
            if (response.status === 201) {
                window.location.href = "/login";
            } else {
                alert("Registration failed. Check inputs.");
                console.error(response.data);
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (step < fields.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleChange = (key: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    // Step selector
    if (!role) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-6">
                <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-800">
                    <Title size="lg">Sign Up</Title>
                    <div className="flex flex-col gap-6">
                        <button
                            onClick={() => setRole("athlete")}
                            className="neon-btn w-full bg-amber-500 hover:bg-amber-400 text-black py-3 rounded-xl font-semibold transition"
                        >
                            I am an Athlete
                        </button>
                        <button
                            onClick={() => setRole("trainer")}
                            className="neon-btn w-full bg-pink-500 hover:bg-pink-400 text-black py-3 rounded-xl font-semibold transition"
                        >
                            I am a Trainer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentField = fields[step];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-gray-900 p-6">
            <div className="w-full max-w-md bg-gray-900 text-white rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-800">
                <Title size="lg">Sign Up as {role === "athlete" ? "Athlete" : "Trainer"}</Title>

                {/* Progress Bar */}
                <ProgressBar step={step} total={fields.length} />

                {/* Animated Step */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-4 mt-4"
                    >
                        <h2 className="text-lg text-blue-300 font-semibold">{currentField.label}</h2>

                        {currentField.type === "select" ? (
                            <select
                                value={formData[currentField.key]}
                                onChange={(e) => handleChange(currentField.key, e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                            >
                                <option value="" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        ) : (
                            <input
                                type={currentField.type}
                                placeholder={currentField.label}
                                value={formData[currentField.key]}
                                onChange={(e) => handleChange(currentField.key, e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                                max={currentField.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                                required
                            />
                        )}

                        <button
                            onClick={handleNext}
                            disabled={loading || (currentField.key === "gender" && !formData.gender)}
                            className={`neon-btn w-full py-3 rounded-xl font-semibold transition ${
                                loading
                                    ? "bg-gray-700 cursor-not-allowed opacity-70"
                                    : "bg-amber-500 hover:bg-amber-400 text-black"
                            }`}
                        >
                            {step < fields.length - 1 ? "Next" : loading ? "Submitting..." : "Submit"}
                        </button>

                        {step > 0 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                disabled={loading}
                                className="text-md text-amber-400 hover:underline mt-2 w-full"
                            >
                                Back
                            </button>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
