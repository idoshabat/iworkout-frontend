import Button from "@/app/components/Button";
import { POST } from "@/app/lib/utils";
import { useState } from "react";

export default function AddAthleteToWorkoutModal({
    user,
    trainer,
    workout,
    onClose,
    onUpdateWorkout, // callback to update workout in parent
}: {
    user: any;
    trainer: any;
    workout: any;
    onClose: () => void;
    onUpdateWorkout: (updatedWorkout: any) => void;
}) {
    const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value; // always a string
        setSelectedAthletes((prev) => {
            if (prev.includes(value)) {
                // remove it
                return prev.filter((id) => id !== value);
            } else {
                // add it
                return [...prev, value];
            }
        });
    }


    async function addAthleteToWorkout() {
        const res = await POST(`/workouts/${workout.id}/add-athlete/`, {
            athlete_ids: selectedAthletes,
        });

        if (res.ok) {
            // Update workout's athletes without refreshing
            const updatedWorkout = {
                ...workout,
                athletes: selectedAthletes, // IDs of updated athletes
            };
            onUpdateWorkout(updatedWorkout);

            alert("Athletes updated successfully!");
            onClose();
        } else {
            alert("Failed to update athletes.");
        }
    }

    

    return (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Box */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold">Add Athlete to Workout</h2>
                    <Button onClick={onClose}>✕</Button>
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Select Athletes</h3>
                    <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {trainer?.athletes?.length > 0 ? (
                            trainer.athletes.map((athlete: any) => (
                                <li key={athlete.id} className="flex items-center gap-2">
                                    <input
                                        id={`athlete-${athlete.id}`}
                                        type="checkbox"
                                        value={athlete.id.toString()} // ensure it's a string
                                        className="w-4 h-4 accent-blue-500"
                                        checked={selectedAthletes.includes(athlete.id.toString())} // compare strings
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`athlete-${athlete.id}`} className="text-gray-700">
                                        {athlete.id + " - " + athlete.first_name + " " + athlete.last_name}
                                    </label>
                                </li>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No athletes found.</p>
                        )}
                    </ul>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t">
                    <Button onClick={addAthleteToWorkout}>Update Athletes</Button>
                </div>
            </div>
        </div>
    );
}
