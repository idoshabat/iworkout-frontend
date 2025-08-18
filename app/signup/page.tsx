"use client";
import { useState } from "react";
// import {GET} from "@/app/lib/utils";

export default function SignupPage() {
    const [role, setRole] = useState<"athlete" | "trainer" | null>(null);

    function generateRegisterURL() {
        if (role === "athlete") {
            return "/register/athlete";
        } else if (role === "trainer") {
            return "/register/trainer";
        }
        return "/register";
    }

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center  bg-black p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">הרשמה</h1>

                {/* Step 1: Choose role */}
                {!role && (
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => setRole("athlete")}
                            className="w-full cursor-pointer bg-black hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            אני מתאמן
                        </button>
                        <button
                            onClick={() => setRole("trainer")}
                            className="w-full cursor-pointer bg-black hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            אני מאמן
                        </button>
                    </div>
                )}

                {/* Step 2: Show form depending on role */}
                {role === "athlete" && (
                    <form className="flex flex-col gap-4 text-black">
                        <input
                            type="text"
                            placeholder="שם מלא"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="email"
                            placeholder="אימייל"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="password"
                            placeholder="סיסמה"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="password"
                            placeholder="הזן סיסמא שנית"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="number"
                            placeholder="גיל"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <button
                            type="submit"
                            className="bg-black cursor-pointer hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            הרשמה כמתאמן
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole(null)}
                            className="text-md text-black hover:underline mt-2 cursor-pointer"
                        >
                            חזור לבחירת תפקיד
                        </button>
                    </form>
                )}

                {role === "trainer" && (
                    <form className="flex flex-col gap-4 text-black">
                        <input
                            type="text"
                            placeholder="שם מלא"
                            className="border rounded-lg p-3 focus:ring-2 focus:black"
                        />
                        <input
                            type="email"
                            placeholder="אימייל"
                            className="border rounded-lg p-3 focus:ring-2 focus:black"
                        />
                        <input
                            type="password"
                            placeholder="סיסמה"
                            className="border rounded-lg p-3 focus:ring-2 focus:black"
                        />
                        <input
                            type="password"
                            placeholder="הזן סיסמא שנית"
                            className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="text"
                            placeholder="התמחות"
                            className="border rounded-lg p-3 focus:ring-2 focus:black"
                        />
                        <button
                            type="submit"
                            className="bg-black cursor-pointer hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            הרשמה כמאמן
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole(null)}
                            className="text-md text-black hover:underline mt-2 cursor-pointer"
                        >
                            חזור לבחירת תפקיד
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
