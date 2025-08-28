'use client'
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { GET, POST } from "../lib/utils";
import Title from "../components/Title";
import Link from "next/link";
import { useUser } from "../lib/UserContext";
import { Suspense } from 'react'


export default function ProfilePage() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [foundUser, setFoundUser] = useState<any>(null);
    // const [userSubscriptions, setUserSubscriptions] = useState<any[]>([]);

    // useEffect(() => {
    //     if (user) {
    //         setUserSubscriptions(user.athlete_profile.subscriptions.map((sub: any) => sub.plan_id));
    //     }
    // }, [user]);

    useEffect(() => {
        if (user) {
            console.log('user.athlete_profile.subscriptions:', user.athlete_profile.subscriptions);
        }
    }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await GET(`/users/get-user-by-email/?email=${email}`);
                // const data = await res.json();
                setFoundUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (email) fetchUser();
    }, [email]);

    const handleSubscribe = async (planId: string | number) => {
        try {
            const res = await POST(`/users/athletes/subscriptions/${planId}/`, {});
            if (res.ok) {
                alert("Successfully subscribed to the plan!");

            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUnsubscribe = async (planId: string | number) => {
        try {
            const res = await POST(`/users/athletes/unsubscriptions/${planId}/`, {});
            if (res.ok) {
                alert("Successfully unsubscribed from the plan!");

            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!foundUser) {
        return <h1 className="text-2xl text-center mt-10 text-gray-400">Loading...</h1>;
    }

    const attributes = [
        { label: "ID", value: foundUser.id },
        { label: "Name", value: `${foundUser.first_name} ${foundUser.last_name}` },
        { label: "Email", value: foundUser.email },
        { label: "Date of birth", value: foundUser.date_of_birth },
        { label: "Role", value: foundUser.role },
        { label: "Gender", value: foundUser.gender },
    ];

    return (
        <Suspense fallback={<h1 className="text-2xl text-center mt-10 text-gray-400">Loading...</h1>}>
            <div className="flex flex-col items-center p-6">
                <Title size="lg">👤 Profile</Title>

                {/* Profile Card */}
                <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold text-white mb-4">User Information</h2>
                    <div className="space-y-3">
                        {attributes.map((attr) => (
                            <div
                                key={attr.label}
                                className="flex justify-between border-b border-gray-700 pb-2"
                            >
                                <span className="text-gray-400">{attr.label}</span>
                                <span className="text-white">{attr.value || "-"}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trainer Section */}
                {foundUser.role === "trainer" && (
                    <>
                        <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Trainer Dashboard</h2>
                            <h3 className="text-lg font-medium text-gray-300 mb-2">My Athletes</h3>

                            {foundUser.trainer_profile?.athletes?.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {foundUser.trainer_profile.athletes.map((athlete: any) => (
                                        <div
                                            key={athlete.id}
                                            className="p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition"
                                        >
                                            <h3 className="text-white font-medium">
                                                {athlete.first_name} {athlete.last_name}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{athlete.email}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">This trainer doesn’t have any athletes yet.</p>
                            )}
                        </div>

                        <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                            <h2 className="text-xl font-semibold text-white mb-4">My Plans</h2>
                            {foundUser.trainer_profile?.plans?.length > 0 ? (
                                <div className="space-y-3">
                                    {foundUser.trainer_profile.plans.map((plan: any) => (
                                        <div
                                            key={plan.id}
                                            className="flex justify-between border-b border-gray-700 pb-2"
                                        >
                                            <Link href={`/my-plans/${plan.id}`} className="text-gray-400">{plan.name}</Link>
                                            <span className="text-white">{plan.description || "-"}</span>
                                            {user && user.athlete_profile.subscriptions.some((sub: any) => sub.plan_id === plan.id && sub.active) ? (
                                                <button className="bg-blue-300 text-black cursor-pointer px-4 py-2 rounded" onClick={() => handleUnsubscribe(plan.id)}>Unsubscribe</button>
                                            ) : (
                                                <button className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded" onClick={() => handleSubscribe(plan.id)}>Subscribe</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">This trainer doesn’t have any plans yet.</p>
                            )}
                        </div>
                    </>
                )}

                {/* Athlete Section */}
                {foundUser.role === "athlete" && (
                    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Athlete Dashboard</h2>
                        <h3 className="text-lg text-gray-300 mb-2">My Trainers</h3>
                        <p className="text-white">
                            {foundUser.athlete_profile?.trainers?.length > 0
                                ? foundUser.athlete_profile.trainers
                                    .map((trainer: any) => `${trainer.first_name} ${trainer.last_name}`)
                                    .join(", ")
                                : "No trainer assigned"}
                        </p>
                    </div>
                )}
            </div>
        </Suspense>
    );
}
