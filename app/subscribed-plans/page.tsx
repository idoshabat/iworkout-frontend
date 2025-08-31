'use client'
import { useEffect, useState } from 'react'
import { GET } from '../lib/utils';
import { Plan } from '../lib/types';
import Link from 'next/link';

export default function SubscribedPlansPage() {
    const [activePlans, setActivePlans] = useState<Plan[]>([]);
    const [inactivePlans, setInactivePlans] = useState<Plan[]>([]);

    useEffect(() => {
        async function fetchPlans() {
            const activeResponse = await GET('/users/athletes/active-subscriptions/');
            const inactiveResponse = await GET('/users/athletes/not-active-subscriptions/');
            
            setActivePlans(activeResponse.data);
            setInactivePlans(inactiveResponse.data);
        }

        fetchPlans();
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* ACTIVE SUBSCRIPTIONS */}
                <section>
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Active Subscriptions
                    </h1>

                    {activePlans.length === 0 ? (
                        <div className="flex items-center justify-center h-40 bg-gray-900 rounded-xl border border-gray-800">
                            <p className="text-gray-400 text-lg">No active subscriptions found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {activePlans.map(plan => (
                                <div
                                    key={plan.id}
                                    className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl hover:border-indigo-500 transition-all p-5 flex flex-col justify-between"
                                >
                                    <div>
                                        <Link 
                                            href={`/my-plans/${plan.id}`}
                                            className="text-xl font-semibold text-indigo-400 hover:text-indigo-300 transition-colors block"
                                        >
                                            {plan.name}
                                        </Link>
                                        <p className="mt-2 text-gray-400 text-sm">
                                            {plan.description || "No description available"}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={`/my-plans/${plan.id}`}
                                            className="inline-block text-sm font-medium bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-500 transition"
                                        >
                                            View Plan
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* INACTIVE SUBSCRIPTIONS */}
                <section>
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">
                        Inactive Subscriptions
                    </h1>

                    {inactivePlans.length === 0 ? (
                        <div className="flex items-center justify-center h-40 bg-gray-900 rounded-xl border border-gray-800">
                            <p className="text-gray-400 text-lg">No inactive subscriptions found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {inactivePlans.map(plan => (
                                <div
                                    key={plan.id}
                                    className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 hover:shadow-xl hover:border-red-500 transition-all p-5 flex flex-col justify-between"
                                >
                                    <div>
                                        <span className="text-xl font-semibold text-red-400 block">
                                            {plan.name}
                                        </span>
                                        <p className="mt-2 text-gray-400 text-sm">
                                            {plan.description || "No description available"}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={`/plans/${plan.id}`}
                                            className="inline-block text-sm font-medium bg-gray-700 text-white py-2 px-4 rounded-xl hover:bg-gray-600 transition"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
