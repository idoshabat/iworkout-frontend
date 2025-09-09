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
    sender: string | number;
};

export default function InvitationsPage() {
    const { user } = useUser();

    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loadingId, setLoadingId] = useState<string | number | null>(null);

    useEffect(() => {
        const fetchInvitations = async () => {
            const data = await GET('/users/invitations/');
            setInvitations(data.data);
        };
        fetchInvitations();
    }, []);

    const handleRespond = async (id: string | number, action: 'accept' | 'decline') => {
        setLoadingId(id);
        const res = await POST(`/users/invitations/${id}/respond/`, { "action": action });
        if (res.ok) {
            setInvitations((prev) =>
                prev.map((inv) =>
                    inv.id === id ? { ...inv, status: action === 'accept' ? 'accepted' : 'declined' } : inv
                )
            );
        } else {
            const errorData = res.data;
            console.error("Error responding to invitation:", errorData);
        }
        setLoadingId(null);
    };

    return (
        <div className="p-6">
            <div className="grid gap-6">
                <Title>Invitations</Title>

                <div className="flex justify-end mb-4">
                    {user ? (
                        user.role === "trainer" ? (
                            <Link
                                href="/find-athlete"
                                className="neon-btn"
                            >
                                Find Athlete
                            </Link>
                        ) : (
                            <Link
                                href="/find-trainer"
                                className="neon-btn"
                            >
                                Find Trainer
                            </Link>
                        )
                    ) : (
                        <p>Loading user...</p>
                    )}
                </div>

                {invitations.length > 0 ? invitations.map((invitation) => (
                    <div
                        className="neon-card"
                        key={invitation.id}
                    >
                        <h2 className="text-lg font-semibold text-gray-100">
                            {invitation.trainer_name} <span className="font-normal text-gray-400">invited</span> {invitation.athlete_name}
                        </h2>
                        <p className="text-sm text-gray-300">
                            Status: <span className={
                                invitation.status === 'pending'
                                    ? 'text-yellow-400 font-medium'
                                    : invitation.status === 'accepted'
                                        ? 'text-green-400 font-medium'
                                        : 'text-red-400 font-medium'
                            }>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </span>
                        </p>
                        {user && invitation.status === 'pending' && invitation.sender !== user.id && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="neon-btn-green"
                                    disabled={loadingId === invitation.id}
                                    onClick={() => handleRespond(invitation.id, 'accept')}
                                >
                                    Accept
                                </button>
                                <button
                                    className="neon-btn-red"
                                    disabled={loadingId === invitation.id}
                                    onClick={() => handleRespond(invitation.id, 'decline')}
                                >
                                    Decline
                                </button>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="text-gray-400">No invitations available.</p>
                )}
            </div>

            {/* Neon styles */}
            <style jsx>{`
                .neon-card {
                    background: #111;
                    border: 1px solid rgba(0,255,247,0.3);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 0 0 15px rgba(0,255,247,0.2), 0 0 25px rgba(110,0,255,0.2);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .neon-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 0 25px rgba(0,255,247,0.4), 0 0 35px rgba(110,0,255,0.4);
                }
                .neon-btn {
                    display: inline-block;
                    padding: 0.5rem 1.5rem;
                    border-radius: 0.75rem;
                    background: linear-gradient(90deg, #6e00ff, #00fff7);
                    color: white;
                    font-semibold: 600;
                    text-align: center;
                    box-shadow: 0 0 10px rgba(110,0,255,0.6), 0 0 20px rgba(0,255,247,0.6);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .neon-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px rgba(110,0,255,0.8), 0 0 25px rgba(0,255,247,0.8);
                }
                .neon-btn-green {
                    background: linear-gradient(90deg, #00ff7f, #00c851);
                    color: black;
                    font-weight: 600;
                    padding: 0.25rem 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 0 8px #00ff7f, 0 0 12px #00c851;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .neon-btn-green:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 12px #00ff7f, 0 0 18px #00c851;
                }
                .neon-btn-red {
                    background: linear-gradient(90deg, #ff3c3c, #ff1a1a);
                    color: white;
                    font-weight: 600;
                    padding: 0.25rem 1rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 0 8px #ff3c3c, 0 0 12px #ff1a1a;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .neon-btn-red:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 12px #ff3c3c, 0 0 18px #ff1a1a;
                }
            `}</style>
        </div>
    );
}
