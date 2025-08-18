// app/lib/UserContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from './utils';

type UserContextType = {
    user: any;
    setUser: (user: any) => void;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);

    async function refreshUser() {
        try {
            const u = await getCurrentUser();
            setUser(u);
        } catch {
            setUser(null);
        }
    }

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used inside UserProvider");
    return context;
}
