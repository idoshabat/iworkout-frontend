"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GET, POST, PATCH } from "@/app/lib/utils";
import { Workout, Plan } from "@/app/lib/types";
import Link from "next/link";
import AddWorkoutToPlanModal from "@/app/components/AddWorkoutToPlanModal";
import { useUser } from "@/app/lib/UserContext";
import Button from "@/app/components/Button";

export default function PlanPage() {
  const { user } = useUser();
  const { id } = useParams();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    is_active: true,
    workouts: [] as number[],
  });

  // Fetch plan
  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await GET(`/users/trainers/plans/${id}/`);
        if (res.status === 200) {
          setPlan(res.data);
          setEditData({
            name: res.data.name,
            description: res.data.description,
            price: res.data.price,
            is_active: res.data.is_active,
            workouts: res.data.workouts.map((w: Workout) => w.id),
          });
        }
      } catch (error) {
        console.error("Failed to fetch plan:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
  }, [id]);

  // Fetch workouts for trainer
  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await GET("/users/trainers/workouts/");
        if (res.status === 200) {
          setAllWorkouts(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    }
    if (user?.role === "trainer") fetchWorkouts();
  }, [user]);

  function handleUpdatePlanWorkouts(updatedWorkouts: Workout[]) {
    if (plan) {
      setPlan({
        ...plan,
        workouts: updatedWorkouts,
      });
    }
  }

  const handleSubscribe = async () => {
    try {
      if (plan) {
        const res = await POST(`/users/athletes/subscriptions/${plan.id}/`, {});
        if (res.ok) {
          alert("Successfully subscribed to the plan!");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      if (plan) {
        const res = await POST(
          `/users/athletes/unsubscriptions/${plan.id}/`,
          {}
        );
        if (res.ok) {
          alert("Successfully unsubscribed from the plan!");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSave = async () => {
    try {
      if (!plan) return;
      const res = await PATCH(`/users/trainers/plans/${plan.id}/`, editData);
      if (res.status === 200) {
        const updated = res.data;
        setPlan(updated);
        setShowEdit(false);
        alert("Plan updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user)
    return <p className="p-4">You must be logged in to view this page.</p>;

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
        <div className="h-40 bg-gray-800 rounded"></div>
      </div>
    );
  }

  if (!plan) return <p className="p-4">Plan not found.</p>;

  if (user.role === "trainer" && user.id !== plan.trainer) {
    return <p className="p-4">You are not authorized to view this plan.</p>;
  } else if (
    user.role === "athlete" &&
    !plan.subscriptions
      .map((sub) => (sub.active ? sub.athlete_id : null))
      .includes(user.id)
  ) {
    return (
      <div className="p-6">
        <p className="mb-4 text-gray-300">You are not subscribed to this plan.</p>
        <button
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{plan.name}</h1>
          <p className="text-gray-600 mt-1">{plan.description}</p>
        </div>
        {user.role === "trainer" && user.id === plan.trainer && (
          <Button onClick={() => setShowEdit(true)}>✏️ Edit</Button>
        )}
      </div>

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
          Subscribed athletes –{" "}
          {plan.subscriptions.length > 0
            ? plan.subscriptions
                .map((sub) => (sub.active ? sub.athlete : null))
                .filter(Boolean)
                .join(", ")
            : "No athletes subscribed"}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Workouts in this Plan</h2>
        {user.role === "trainer" && (
          <Button onClick={() => setShowModal(true)}>➕ Add Workout</Button>
        )}
      </div>

      {plan.workouts.length === 0 ? (
        <p className="text-gray-500 mt-2">No workouts added yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 mt-2">
          {plan.workouts.map((w) => (
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

      {user.role === "athlete" && (
        <button
          onClick={handleUnsubscribe}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Unsubscribe
        </button>
      )}

      {/* Add Workout Modal */}
      {showModal && (
        <AddWorkoutToPlanModal
          plan={plan}
          onClose={() => setShowModal(false)}
          onUpdatePlan={handleUpdatePlanWorkouts}
        />
      )}

      {/* Edit Plan Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Plan</h2>

            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Plan Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              placeholder="Price"
              className="w-full mb-2 p-2 border rounded"
            />

            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={editData.is_active}
                onChange={(e) =>
                  setEditData({ ...editData, is_active: e.target.checked })
                }
              />
              <span>Active</span>
            </label>

            {/* Stylish workouts selector */}
            <label className="block mb-2 font-medium">Workouts</label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {allWorkouts.length === 0 ? (
                <p className="text-gray-500 text-sm">No workouts available</p>
              ) : (
                allWorkouts.map((w) => (
                  <label
                    key={w.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition ${
                      editData.workouts.includes(w.id)
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">{w.name}</span>
                    <input
                      type="checkbox"
                      checked={editData.workouts.includes(w.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditData({
                            ...editData,
                            workouts: [...editData.workouts, w.id],
                          });
                        } else {
                          setEditData({
                            ...editData,
                            workouts: editData.workouts.filter(
                              (wid) => wid !== w.id
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 accent-blue-600"
                    />
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setShowEdit(false)}>Cancel</Button>
              <Button onClick={handleEditSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
