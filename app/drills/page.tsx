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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchDrills = async () => {
      try {
        const url =
          user.role === "athlete"
            ? `/users/athletes/drills`
            : `/users/trainers/drills`;
        const res = await GET(url);
        setDrills(res.data || []);
      } catch (err) {
        console.error("Failed to fetch drills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrills();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0e0b22] to-[#050317] text-white">
        <Title size="lg">🏋️ Drills</Title>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-5xl p-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse p-6 bg-[#121028]/40 backdrop-blur-lg rounded-2xl border border-[#6e00ff]/50 shadow-lg"
            >
              <div className="h-5 bg-[#6e00ff]/40 rounded w-2/3 mb-4"></div>
              <div className="h-3 bg-[#00fff7]/40 rounded w-full mb-2"></div>
              <div className="h-3 bg-[#6e00ff]/40 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gradient-to-b from-[#0e0b22] to-[#050317] text-white">
      <Title size="lg" subtitle="Next-level drills management">🏋️ Drills</Title>

      {drills.length === 0 ? (
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#6e00ff]/40 via-[#00fff7]/40 to-[#6e00ff]/40 animate-pulse shadow-lg"></div>
          <p className="text-gray-400 text-lg text-center">
            {user.role === "athlete"
              ? "No drills assigned yet by your coaches."
              : "You haven’t created any drills yet."}
          </p>
          {user.role === "trainer" && (
            <CreateDrillModal userId={user.id} setDrills={setDrills} />
          )}
        </div>
      ) : (
        <div className="mt-8 w-full max-w-5xl">
          {user.role === "athlete" ? (
            <>
              <Title size="md">Drills from my coaches</Title>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {drills.map((drill) => (
                  <div
                    key={drill.id}
                    className="p-6 bg-[#121028]/40 backdrop-blur-lg border border-[#6e00ff]/50 rounded-2xl shadow-lg hover:shadow-[#00fff7]/60 transition transform hover:scale-105"
                  >
                    <Link
                      href={`/drills/${drill.id}`}
                      className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] hover:underline"
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
            </>
          ) : (
            <>
              <Title size="md">My Created Drills</Title>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {drills.map((drill) => (
                  <div
                    key={drill.id}
                    className="p-6 bg-[#121028]/40 backdrop-blur-lg border border-[#00fff7]/50 rounded-2xl shadow-lg hover:shadow-[#6e00ff]/60 transition transform hover:scale-105"
                  >
                    <Link
                      href={`/drills/${drill.id}`}
                      className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6e00ff] to-[#00fff7] hover:underline"
                    >
                      {drill.name}
                    </Link>
                    <p className="text-gray-400 mt-2">{drill.description}</p>
                    <p className="text-gray-500 text-sm mt-2">Created by you</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <CreateDrillModal userId={user.id} setDrills={setDrills} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
