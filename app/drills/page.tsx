'use client'
import { useUser } from "@/app/lib/UserContext";
import { useState, useEffect } from "react";
import CreateDrillModal from "../components/CreateDrillModal";
import {GET} from "@/app/lib/utils";

export default function DrillsPage() {
    const { user } = useUser();
    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }
    console.log('USER', user);
    // const [showModal, setShowModal] = useState<boolean>(false);
    const [drills, setDrills] = useState<any[]>([]); // Placeholder for drills data

    useEffect(() => {
        const fetchDrills = async () => {
            const data = await GET("/drills");
            setDrills(data);
        };
        fetchDrills();
    }, []);

    return (
        <div>
            <h1>Drills</h1>
            {(user && user.role === "athlete") ? (
                <div>
                    <h2>Drills from my coaches</h2>
                    {/* Admin controls go here */}
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h2>I'm the coach and these are my drills</h2>
                    <div className="flex flex-col gap-4">
                        {drills.map((drill) => (
                            <div key={drill.id} className="p-4 border rounded-lg">
                                <h3 className="text-xl font-bold">{drill.name}</h3>
                                <p>{drill.description}</p>
                            </div>
                        ))}
                    <CreateDrillModal userId={user.id} setDrills={setDrills} />
                    </div>
                </div>
            )}
        </div>
    );
}
