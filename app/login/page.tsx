'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/lib/utils";
import { useUser } from "@/app/lib/UserContext";
import Title from "../components/Title";

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-900 text-white shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6 border border-gray-800"
            >
                <Title size="lg">Login</Title>

                {error && (
                    <p className="text-red-500 text-center font-medium animate-pulse">
                        {error}
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="neon-btn w-full py-3 cursor-pointer"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center text-gray-400 text-sm mt-2">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-amber-400 font-semibold hover:underline">
                        Sign up here
                    </a>
                </p>
            </form>
        </div>
    );
}
