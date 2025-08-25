"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GET } from "@/app/lib/utils";
import {Workout , Plan ,Subscription} from "@/app/lib/types"; // adjust path if your GET function is elsewhere
import Link from "next/link";


export default function PlanPage() {
  const { id } = useParams(); // dynamic route param
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const data = await GET(`/users/trainers/plans/${id}/`);
        setPlan(data);
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
  }, [id]);

  if (loading) return <p className="p-4">Loading plan...</p>;
  if (!plan) return <p className="p-4">Plan not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{plan.name}</h1>
      <p className="text-gray-600 mt-1">{plan.description}</p>

      <div className="mt-4">
        <p className="font-medium">💰 Price: {plan.price} USD</p>
        <p
          className={`mt-1 ${
            plan.is_active ? "text-green-600" : "text-red-600"
          }`}
        >
          {plan.is_active ? "Active" : "Inactive"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Subscribed athletes - {plan.subscriptions.map((sub) => sub.athlete).join(", ")}
        </p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Workouts in this Plan</h2>
      {plan.workouts.length === 0 ? (
        <p className="text-gray-500">No workouts added yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plan.workouts.map((w) => (
            <div
              key={w.id}
              className="rounded-xl border p-4 shadow-sm hover:shadow-md transition"
            >
              <Link href={`/workouts/${w.id}`} className="text-lg font-semibold">{w.name}</Link>
              <p className="text-sm text-gray-600">{w.description}</p>
              {/* <p className="mt-2">⏱ {w.duration} min</p>
              <p>🔥 Intensity: {w.intensity}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
