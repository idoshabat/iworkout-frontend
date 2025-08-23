'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, getCurrentTrainer, getCurrentAthlete } from './utils';

type UserContextType = {
    user: any;
    setUser: (user: any) => void;
    refreshUser: () => Promise<void>;
    trainer: any;
    athlete: any;
    refreshTrainer: () => Promise<void>;
    refreshAthlete: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [trainer, setTrainer] = useState<any>(null);
    const [athlete, setAthlete] = useState<any>(null);

    async function refreshUser() {
        try {
            const u = await getCurrentUser();
            setUser(u);

            // If user is trainer or athlete, load their profile
            if (u?.role === 'trainer') {
                const t = await getCurrentTrainer();
                setTrainer(t);
            } else {
                setTrainer(null);
            }

            if (u?.role === 'athlete') {
                const a = await getCurrentAthlete();
                setAthlete(a);
            } else {
                setAthlete(null);
            }
        } catch {
            setUser(null);
            setTrainer(null);
            setAthlete(null);
        }
    }

    async function refreshTrainer() {
        if (user?.role === 'trainer') {
            const t = await getCurrentTrainer();
            setTrainer(t);
        }
    }

    async function refreshAthlete() {
        if (user?.role === 'athlete') {
            const a = await getCurrentAthlete();
            setAthlete(a);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser, trainer, athlete, refreshTrainer, refreshAthlete }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used inside UserProvider");
    return context;
}

export function useTrainer() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useTrainer must be used inside UserProvider");
    if (context.user?.role !== 'trainer') throw new Error("useTrainer can only be used by trainers");
    return { trainer: context.trainer, refreshTrainer: context.refreshTrainer };
}

export function useAthlete() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useAthlete must be used inside UserProvider");
    if (context.user?.role !== 'athlete') throw new Error("useAthlete can only be used by athletes");
    return { athlete: context.athlete, refreshAthlete: context.refreshAthlete };
}
