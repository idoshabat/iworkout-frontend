"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GET } from "@/app/lib/utils";
import { Workout, Plan, Subscription } from "@/app/lib/types";
import Link from "next/link";
import AddWorkoutToPlanModal from "@/app/components/AddWorkoutToPlanModal";
import { useUser } from "@/app/lib/UserContext";
import Button from "@/app/components/Button";

export default function PlanPage() {
  const { user } = useUser();
  const { id } = useParams(); // dynamic route param
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await GET(`/users/trainers/plans/${id}/`);
        console.log("Fetched plan data:", res.data);
        if (res.status === 200)
          setPlan(res.data);
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
  }, [id]);

  function handleUpdatePlanWorkouts(updatedWorkouts: Workout[]) {
    if (plan) {
      setPlan({
        ...plan,
        workouts: updatedWorkouts,
      });
    }
  }

  if (loading) return <p className="p-4">Loading plan...</p>;
  if (!plan) return <p className="p-4">Plan not found.</p>;
  if (user.id !== plan.trainer && !plan.subscriptions.map((sub) => sub.athlete_id).includes(user.id)) {
    return <p className="p-4">You are not authorized to view this plan.</p>;
  }

  // if (!plan.subscriptions.map((sub) => sub.athlete).includes(user.id)) {
  //   return <p className="p-4">You are not authorized to view this plan.</p>;
  // }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{plan.name}</h1>
      <p className="text-gray-600 mt-1">{plan.description}</p>

      <div className="mt-4">
        <p className="font-medium">💰 Price: {plan.price} USD</p>
        <p
          className={`mt-1 ${plan.is_active ? "text-green-600" : "text-red-600"
            }`}
        >
          {plan.is_active ? "Active" : "Inactive"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Subscribed athletes -{" "}
          {plan.subscriptions.length > 0 ? plan.subscriptions.map((sub) => sub.athlete).join(", ") : "No athletes subscribed"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Workouts in this Plan</h2>
        <Button onClick={() => setShowModal(true)}>➕ Add Workout</Button>
      </div>

      {plan.workouts.length === 0 ? (
        <p className="text-gray-500 mt-2">No workouts added yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 mt-2">
          {plan.workouts.length > 0 && plan.workouts.map((w) => (
            <div
              key={w.id}
              className="rounded-xl border p-4 shadow-sm hover:shadow-md transition"
            >
              <Link
                href={`/workouts/${w.id}`}
                className="text-lg font-semibold"
              >
                {w.name}
              </Link>
              <p className="text-sm text-gray-600">{w.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddWorkoutToPlanModal
          // trainer={user.trainer_profile}
          plan={plan}
          onClose={() => setShowModal(false)}
          onUpdatePlan={handleUpdatePlanWorkouts}
        />
      )}
    </div>
  );
}
