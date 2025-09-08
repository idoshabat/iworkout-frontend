'use client'
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from 'react';
import { GET, POST } from "../lib/utils";
import Title from "../components/Title";
import Link from "next/link";
import { useUser } from "../lib/UserContext";

export default function ProfileContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [foundUser, setFoundUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GET(`/users/get-user-by-email/?email=${email}`);
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
        window.location.reload();
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
        window.location.reload();
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
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#0e0b22] to-[#0a0916] min-h-screen text-white">
      <Title size="lg" subtitle="High-tech user dashboard">👤 Profile</Title>

      {/* Profile Card */}
      <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-3xl shadow-lg p-8 mt-6 hover:shadow-[#6e00ff]/50 transition duration-500">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-6">
          User Information
        </h2>
        <div className="space-y-4">
          {attributes.map((attr) => (
            <div key={attr.label} className="flex justify-between items-center pb-3 border-b border-[#6e00ff]/30">
              <span className="text-[#aaa]">{attr.label}</span>
              <span className="font-medium">{attr.value || "-"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trainer Section */}
      {foundUser.role === "trainer" && (
        <>
          {/* Athletes */}
          <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#00fff7]/50 transition duration-500">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00f7] to-[#00fff7] mb-4">🏋️ My Athletes</h2>
            {foundUser.trainer_profile?.athletes?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {foundUser.trainer_profile.athletes.map((athlete: any) => (
                  <div
                    key={athlete.id}
                    className="p-4 rounded-xl bg-[#1c1a33]/70 border border-[#6e00ff]/50 shadow-lg hover:shadow-[#ff00f7]/60 transition transform hover:-translate-y-1 duration-300"
                  >
                    <h3 className="font-bold text-[#fff]">{athlete.first_name} {athlete.last_name}</h3>
                    <p className="text-[#aaa] text-sm">{athlete.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888]">This trainer doesn’t have any athletes yet.</p>
            )}
          </div>

          {/* Plans */}
          <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#00fff7]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#6e00ff]/50 transition duration-500">
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-4">📋 My Plans</h2>
            {foundUser.trainer_profile?.plans?.length > 0 ? (
              <div className="space-y-4">
                {foundUser.trainer_profile.plans.map((plan: any) => (
                  <div
                    key={plan.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#6e00ff]/30 pb-3"
                  >
                    <Link
                      href={`/my-plans/${plan.id}`}
                      className="text-[#ff00f7] hover:text-[#00fff7] font-semibold"
                    >
                      {plan.name}
                    </Link>
                    <span className="text-[#aaa] text-sm flex-1 px-2">{plan.description || "-"}</span>
                    {user && user.athlete_profile?.subscriptions.some((sub: any) => sub.plan_id === plan.id && sub.active) ? (
                      <button
                        className="mt-2 md:mt-0 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#ff003c] to-[#ff00f7] text-white shadow-lg hover:scale-105 hover:shadow-[#ff00f7]/50 transition duration-300"
                        onClick={() => handleUnsubscribe(plan.id)}
                      >
                        Unsubscribe
                      </button>
                    ) : (
                      <button
                        className="mt-2 md:mt-0 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#6e00ff] to-[#00fff7] text-white shadow-lg hover:scale-105 hover:shadow-[#00fff7]/50 transition duration-300"
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        Subscribe
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#888]">This trainer doesn’t have any plans yet.</p>
            )}
          </div>
        </>
      )}

      {/* Athlete Section */}
      {foundUser.role === "athlete" && (
        <div className="w-full max-w-3xl bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-3xl shadow-lg p-8 mt-10 hover:shadow-[#00fff7]/50 transition duration-500">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] mb-4">🎯 Athlete Dashboard</h2>
          <h3 className="text-lg text-[#aaa] mb-2">My Trainers</h3>
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
  );
}
