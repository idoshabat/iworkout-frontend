"use client";

import { useUser } from "@/app/lib/UserContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import CreateDrillModal from "../components/CreateDrillModal";
import { GET } from "@/app/lib/utils";

export default function DrillsPage() {
    const { user } = useUser();
    const [drills, setDrills] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return; // only fetch if user exists
        const fetchDrills = async () => {
            const data = await GET(`/users/trainers/drills`);
            setDrills(data);
        };
        fetchDrills();
    }, [user]);

    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }

    return (
        <div>
            <h1>Drills</h1>
            {user.role === "athlete" ? (
                <div>
                    <h2>Drills from my coaches</h2>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h2>I'm the coach and these are my drills</h2>
                    <div className="flex flex-col gap-4">
                        {drills.map((drill) => (
                            <div key={drill.id} className="p-4 border rounded-lg">
                                <Link href={`/drills/${drill.id}`} className="text-xl font-bold">{drill.name}</Link>
                                <p>{drill.description}</p>
                                <p>Created by: {drill.trainer}</p>
                            </div>
                        ))}
                        <CreateDrillModal userId={user.id} setDrills={setDrills} />
                    </div>
                </div>
            )}
        </div>
    );
}
