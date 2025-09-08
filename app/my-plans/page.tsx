"use client";
import { useEffect, useState } from "react";
import { GET } from "@/app/lib/utils";
import Link from "next/link";
import CreatePlanModal from "../components/CreatePlanModal";
import Title from "../components/Title";

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
        if (Array.isArray(data.data)) {
          setPlans(data.data);
        } else if (data.data.results) {
          // pagination support
          setPlans(data.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  // 1️⃣ Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-amber-400 border-opacity-70"></div>
        <span className="text-gray-300 text-lg animate-pulse">
          Loading your awesome plans...
        </span>
      </div>
    );
  }

  // 2️⃣ Empty state after loading
  if (!loading && plans.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-6">
          <CreatePlanModal setPlans={setPlans} />
        </div>
        <p className="text-gray-400 text-lg italic">
          You don’t have any plans yet.  
          <span className="text-amber-400 font-semibold">
            {" "}Create your first one!
          </span>
        </p>
      </div>
    );
  }

  // 3️⃣ Success state
  return (
    <div className="p-6">
      <Title size="lg">
        🌟 My Training Plans
      </Title>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg hover:shadow-amber-500/30 transition group"
          >
            <Link
              href={`/my-plans/${plan.id}`}
              className="block text-xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transform transition"
            >
              {plan.name}
            </Link>

            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
              {plan.description || "No description provided."}
            </p>

            <div className="mt-4 space-y-1">
              <p className="font-semibold text-amber-300">
                💰 {plan.price} USD
              </p>
              <p
                className={`text-sm font-medium ${
                  plan.is_active ? "text-green-400" : "text-red-400"
                }`}
              >
                {plan.is_active ? "✅ Active" : "❌ Inactive"}
              </p>
            </div>

            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-400/50 transition pointer-events-none"></div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <CreatePlanModal setPlans={setPlans} />
      </div>
    </div>
  );
}
