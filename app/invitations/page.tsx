'use client'
import { useState, useEffect } from 'react';
import { GET, POST } from '../lib/utils';
import { useUser } from '../lib/UserContext';
import Title from '../components/Title';
import Link from 'next/link'

type Invitation = {
    id: string | number;
    trainer: string | number;
    trainer_name: string;
    athlete: string | number;
    athlete_name: string;
    status: string;
};

export default function InvitationsPage() {
    const { user, setUser } = useUser();

    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loadingId, setLoadingId] = useState<string | number | null>(null);

    useEffect(() => {
        const fetchInvitations = async () => {
            const data = await GET('/users/invitations/');
            setInvitations(data);
        };
        fetchInvitations();
    }, []);


    const handleRespond = async (id: string | number, action: 'accept' | 'decline') => {
        setLoadingId(id);
        const res = await POST(`/users/invitations/${id}/respond/`, { "action": action });
        if (res.ok) {
            // Update the invitation status locally
            setInvitations((prev) =>
                prev.map((inv) =>
                    inv.id === id ? { ...inv, status: action === 'accept' ? 'accepted' : 'declined' } : inv
                )
            );
        } else {
            const errorData = await res.json();
            console.error("Error responding to invitation:", errorData.error || errorData.message || errorData);
        }
        setLoadingId(null);
    };

    return (
        <div>
            <div className="grid gap-6 mt-6">
                <Title>Invitations</Title>
                <div className="flex justify-end mb-4">
                    {user ? (
                        user.role === "trainer" ? (
                            <Link
                                href="/find-athlete"
                                className="inline-block px-5 py-2 rounded-md bg-gray-600 text-white font-semibold shadow hover:bg-gray-700 transition-colors"
                            >
                                Find Athlete
                            </Link>
                        ) : (
                            <Link
                                href="/find-trainer"
                                className="inline-block px-5 py-2 rounded-md bg-gray-600 text-white font-semibold shadow hover:bg-gray-700 transition-colors"
                            >
                                Find Trainer
                            </Link>
                        )
                    ) : (
                        <p>Loading user...</p>
                    )}
                </div>

                {invitations.map((invitation) => (
                    <div
                        className="rounded-lg shadow-md border border-gray-200 p-6 bg-white flex flex-col gap-2"
                        key={invitation.id}
                    >
                        <h2 className="text-lg font-semibold text-gray-800">
                            {invitation.trainer_name} <span className="font-normal text-gray-500">invited</span> {invitation.athlete_name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Status: <span className={
                                invitation.status === 'pending'
                                    ? 'text-yellow-600 font-medium'
                                    : invitation.status === 'accepted'
                                        ? 'text-green-600 font-medium'
                                        : 'text-red-600 font-medium'
                            }>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </span>
                        </p>
                        {user && invitation.status === 'pending' && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                    disabled={loadingId === invitation.id}
                                    onClick={() => handleRespond(invitation.id, 'accept')}
                                >
                                    Accept
                                </button>
                                <button
                                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                    disabled={loadingId === invitation.id}
                                    onClick={() => handleRespond(invitation.id, 'decline')}
                                >
                                    Decline
                                </button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
