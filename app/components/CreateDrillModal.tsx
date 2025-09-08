"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { GET, POST } from "../lib/utils";
import CloudinaryVideoPicker from "./CloudinaryVideoPicker";

type DrillFormData = {
  sport: string;
  name: string;
  description: string;
  category: string;
  trainer?: string;
};

export default function CreateDrillModal({ userId, setDrills }: { userId: string; setDrills: (drills: any[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<DrillFormData>();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoPublicId, setVideoPublicId] = useState<string | null>(null);

  const sportTypes = ["Soccer", "Basketball", "Tennis"];
  const categoryTypes: Record<string, string[]> = {
    basketball: ["Shooting", "Dribbling", "Defense", "Rebounding", "Passing"],
    soccer: ["Passing", "Dribbling", "Shooting", "Defense", "Goalkeeping"],
    fitness: ["Strength", "Endurance", "Flexibility", "Cardio", "Balance"],
  };

  const selectedSport = watch("sport");

  const handleUploaded = ({ url, public_id }: { url: string; public_id: string }) => {
    setVideoUrl(url);
    setVideoPublicId(public_id);
  };

  const onSubmit = async (data: DrillFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        trainer: userId,
        video_url: videoUrl,
        video_public_id: videoPublicId,
      };

      const res = await POST("/drills/", payload);
      alert("✅ Drill created successfully!");

      const res2 = await GET(`/users/trainers/drills`);
      const drills = res2.data;
      setDrills(drills);

      reset();
      setVideoUrl(null);
      setVideoPublicId(null);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create drill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="neon-btn px-4 py-2 bg-white text-black rounded-lg cursor-pointer hover:bg-gray-200"
        onClick={() => setIsOpen(true)}
      >
        + Create Drill
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Create Drill</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name", { required: true })}
                  placeholder="Enter drill name"
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {/* Sport */}
              <div>
                <label className="block text-sm font-medium">Sport</label>
                <select
                  {...register("sport", { required: true })}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="">Select a sport</option>
                  {sportTypes.map((sport) => (
                    <option key={sport} value={sport.toLowerCase()}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  {...register("category", { required: true })}
                  className="w-full border px-3 py-2 rounded-lg"
                  disabled={!selectedSport}
                >
                  <option value="">
                    {selectedSport ? "Select a category" : "Select a sport first"}
                  </option>
                  {(categoryTypes[selectedSport as keyof typeof categoryTypes] || []).map(
                    (category) => (
                      <option key={category} value={category.toLowerCase()}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Describe the drill..."
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Video (optional)</label>
                <CloudinaryVideoPicker onUploaded={handleUploaded} />
                {videoUrl && (
                  <video controls className="w-full mt-2 rounded-xl">
                    <source src={videoUrl} />
                  </video>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
