// app/login/page.tsx
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
    const { setUser } = useUser(); // get context setter

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const resData = await login(email, password);
            setUser(resData.user);  // ✅ update navbar immediately
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-black">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6"
            >
                <h1 className="text-2xl font-bold text-center text-black">התחבר</h1>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <div>
                    <label className="block text-sm font-medium text-black">אימייל</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-black">סיסמא</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-black mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? "מתחבר..." : "התחבר"}
                </button>
            </form>
        </div>
    );
}
