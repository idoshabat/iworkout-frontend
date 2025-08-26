"use client";

import { useUser } from "@/app/lib/UserContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import CreateDrillModal from "../components/CreateDrillModal";
import { GET } from "@/app/lib/utils";
import Title from "../components/Title";

export default function DrillsPage() {
    const { user } = useUser();
    const [drills, setDrills] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return; // only fetch if user exists
        const fetchDrills = async () => {
            const res = await GET(`/users/trainers/drills`);
            setDrills(res.data);
        };
        fetchDrills();
    }, [user]);

    if (!user) {
        return <h1 className="text-2xl text-center mt-8">Loading...</h1>;
    }

    return (
        <div className="p-6 flex flex-col items-center">
            <Title>🏋️ Drills</Title>

            {user.role === "athlete" ? (
                <div className="mt-8 text-center">
                    <Title size="md">Drills from my coaches</Title>
                    {drills.length === 0 ? (
                        <p className="text-gray-400 mt-4">No drills assigned yet.</p>
                    ) : (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {drills.map((drill) => (
                                <div
                                    key={drill.id}
                                    className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <Link
                                        href={`/drills/${drill.id}`}
                                        className="text-lg font-semibold text-white hover:underline"
                                    >
                                        {drill.name}
                                    </Link>
                                    <p className="text-gray-400 mt-2">{drill.description}</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Coach: {drill.trainer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-8 w-full max-w-4xl flex flex-col items-center">
                    <Title size="md">My Created Drills</Title>

                    {drills.length === 0 ? (
                        <p className="text-gray-400 mt-4">You haven’t created any drills yet.</p>
                    ) : (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {drills.map((drill) => (
                                <div
                                    key={drill.id}
                                    className="p-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
                                >
                                    <Link
                                        href={`/drills/${drill.id}`}
                                        className="text-lg font-semibold text-white hover:underline"
                                    >
                                        {drill.name}
                                    </Link>
                                    <p className="text-gray-400 mt-2">{drill.description}</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Created by you
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <CreateDrillModal userId={user.id} setDrills={setDrills} />
                    </div>
                </div>
            )}
        </div>
    );
}
