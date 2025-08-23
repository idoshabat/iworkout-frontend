'use client'
import AthleteNavbar from './AthleteNavbar';
import TrainerNavbar from './TrainerNavbar';
import { useUser } from '../lib/UserContext';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();

    return (
        <>
            {!user && null}
            {user?.role === 'athlete' && <AthleteNavbar />}
            {user?.role === 'trainer' && <TrainerNavbar />}
            <main>{children}</main>
        </>
    );
}
