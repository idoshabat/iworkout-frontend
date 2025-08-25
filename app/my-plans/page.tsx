"use client";
import { useEffect, useState } from "react";
import { GET } from "@/app/lib/utils"; // adjust path if your GET function is elsewhere
import Link from "next/link";
import CreatePlanModal from "../components/CreatePlanModal";

type Plan = {
  id: number;
  name: string;
  description: string;
  price: string;
  is_active: boolean;
};

export default function MyPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await GET("/users/trainers/plans/");
        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data.results) {
          // in case you use pagination
          setPlans(data.results);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  if (loading) return <p className="p-4">Loading plans...</p>;

  if (plans.length === 0) {
    return <p className="p-4">You don’t have any plans yet.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Plans</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition"
          >
            <Link href={`/my-plans/${plan.id}`} className="text-lg font-semibold">{plan.name}</Link>
            <p className="text-sm text-gray-600">{plan.description}</p>
            <p className="mt-2 font-medium">💰 {plan.price} USD</p>
            <p
              className={`mt-1 text-sm ${
                plan.is_active ? "text-green-600" : "text-red-600"
              }`}
            >
              {plan.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        ))}
      </div>

      <CreatePlanModal setPlans={setPlans} />
    </div>
  );
}
