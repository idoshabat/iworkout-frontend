import { POST } from "@/app/lib/utils";
import { useEffect, useState } from "react";
import { useUser } from "../lib/UserContext";
import { GET } from "@/app/lib/utils";

export default function AddWorkoutToPlanModal({
    plan,
    onClose,
    onUpdatePlan, // callback to update plan in parent
}: {
    plan: any;
    // trainer: any;
    onClose: () => void;
    onUpdatePlan: (updatedPlan: any) => void;
}) {
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const { user } = useUser();

    // Fetch workouts when the modal opens
    useEffect(() => {
        async function fetchWorkouts() {
            const res = await GET(`/users/trainers/workouts/`);
            if (res.ok) {
                const data = await res.data;
                setWorkouts(data);
            }
        }
        fetchWorkouts();
    }, [plan]);

    // useEffect(() => {
    //     console.log('Plan:', plan);
    //     // Perform any side effects or data fetching related to the plan
    // }, [plan]);

    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value; // always a string
        setSelectedWorkouts((prev) => {
            if (prev.includes(value)) {
                return prev.filter((id) => id !== value);
            } else {
                return [...prev, value];
            }
        });
    }

    async function addWorkoutsToPlan() {
        const res = await POST(`/users/trainers/plans/${plan.id}/add-workouts-to-plan/`, {
            workout_ids: selectedWorkouts,
        });

        if (res.ok) {
            // fetch updated plan with workouts from backend
            const refreshed = await GET(`/users/trainers/plans/${plan.id}/`);
            if (refreshed.ok) {
                onUpdatePlan(refreshed.data.workouts);
            }

            alert("Workouts updated successfully!");
            onClose();
        } else {
            const data = await res.data.json().catch(() => ({}));
            alert(data?.detail || "Failed to update workouts.");
        }
    }



    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Box */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">Add Workouts to Plan</h2>
                    <button onClick={onClose} className="text-lg font-bold">✕</button>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Select Workouts</h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {workouts?.length > 0 ? (
                            workouts.map((workout: any) => (
                                <li key={workout.id} className="flex items-center gap-2">
                                    <input
                                        id={`workout-${workout.id}`}
                                        type="checkbox"
                                        value={workout.id.toString()}
                                        className="w-4 h-4 accent-blue-500"
                                        checked={selectedWorkouts.includes(workout.id.toString())}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`workout-${workout.id}`} className="text-gray-700">
                                        {workout.id + " - " + workout.name}
                                    </label>
                                </li>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No workouts found.</p>
                        )}
                    </ul>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t">
                    <button
                        onClick={addWorkoutsToPlan}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        Update Workouts
                    </button>
                </div>
            </div>
        </div>
    );
}
