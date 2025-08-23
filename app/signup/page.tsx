"use client";

import { useState } from "react";
import { POST } from "@/app/lib/utils";

export default function SignupPage() {
    const [role, setRole] = useState<"athlete" | "trainer" | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        setLoading(true);

        try {
            const response = await POST("/users/register/", data);
            const resData = await response.json().catch(() => ({}));

            if (response.status === 201) {
                window.location.href = "/login";
            } else {
                console.error("Registration failed:", resData);
                alert("Registration failed. Please check the inputs.\n" + JSON.stringify(resData, null, 2));
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center mb-4 text-black">Sign Up</h1>

                {/* Step 1: Choose role */}
                {!role && (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setRole("athlete")}
                            className="w-full cursor-pointer bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
                        >
                            I am an Athlete
                        </button>
                        <button
                            onClick={() => setRole("trainer")}
                            className="w-full cursor-pointer bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition"
                        >
                            I am a Trainer
                        </button>
                    </div>
                )}

                {/* Step 2: Registration Form */}
                {role && (
                    <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
                        <input
                            name="first_name"
                            type="text"
                            placeholder="First Name"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                            required
                        />
                        <input
                            name="last_name"
                            type="text"
                            placeholder="Last Name"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                            required
                        />
                        <input
                            name="password2"
                            type="password"
                            placeholder="Confirm Password"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                            required
                        />

                        <select
                            name="gender"
                            defaultValue="prefer_not_to_say"
                            className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                        >
                            <option value="" disabled>Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">Date of Birth</span>
                            <input
                                type="date"
                                name="date_of_birth"
                                className="border rounded-xl p-3 focus:ring-2 focus:ring-black focus:outline-none transition"
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </label>

                        <input type="hidden" name="role" value={role} />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-black text-white py-3 rounded-xl font-semibold transition cursor-pointer ${
                                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
                            }`}
                        >
                            {loading ? "Loading..." : role === "athlete" ? "Sign up as Athlete" : "Sign up as Trainer"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole(null)}
                            disabled={loading}
                            className="text-md text-black hover:underline mt-2 cursor-pointer"
                        >
                            Back to Role Selection
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
