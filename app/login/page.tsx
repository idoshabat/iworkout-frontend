'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useUser();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const resData = await login(email, password);
            setUser(resData.user);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white text-black shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6"
            >
                <h1 className="text-3xl font-bold text-center mb-4">Login</h1>

                {error && (
                    <p className="text-red-600 text-center font-medium">{error}</p>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-500 text-sm mt-2">
                    Don't have an account? <a href="/signup" className="text-blue-600 cursor-pointer">Sign up here</a>
                </p>
            </form>
        </div>
    );
}
