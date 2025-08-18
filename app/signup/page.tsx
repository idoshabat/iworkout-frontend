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
        console.log("Submitting:", data);

        setLoading(true);

        POST("/users/register/", data)
            .then(async (response) => {
                const resData = await response.json().catch(() => ({})); // parse JSON safely

                if (response.status === 201) {
                    window.location.href = "/login";
                } else {
                    console.error("Registration failed:", resData);
                    alert(
                        "Registration failed. Please try again.\n" +
                        JSON.stringify(resData, null, 2)
                    );
                }
            })
            .catch((err) => {
                console.error("Network error:", err);
                alert("Network error. Please try again.");
            })
            .finally(() => setLoading(false));
    }

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-black p-6">
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

                {/* Step 2: Form */}
                {role && (
                    <form className="flex flex-col gap-4 text-black" onSubmit={handleSubmit}>
                        <input name="first_name" type="text" placeholder="שם פרטי" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" />
                        <input name="last_name" type="text" placeholder="שם משפחה" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" />
                        <input name="email" type="email" placeholder="אימייל" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" />
                        <input name="password" type="password" placeholder="סיסמה" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" />
                        <input name="password2" type="password" placeholder="הזן סיסמא שנית" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" />
                        <select name="gender" className="border rounded-lg p-3 focus:ring-2 focus:ring-black" defaultValue="prefer_not_to_say">
                            <option value="" disabled>מגדר</option>
                            <option value="male">זכר</option>
                            <option value="female">נקבה</option>
                            <option value="prefer_not_to_say">מעדיף לא לומר</option>
                        </select>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-black">תאריך לידה</span>
                            <input
                                type="date"
                                name="date_of_birth"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-black"
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </label>

                        <input type="hidden" name="role" value={role} />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-black text-white py-3 rounded-xl font-semibold transition cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-700"
                                }`}
                        >
                            {loading ? "טוען..." : role === "athlete" ? "הרשמה כמתאמן" : "הרשמה כמאמן"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole(null)}
                            disabled={loading}
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
