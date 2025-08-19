
'use client'
import { useUser } from '@/app/lib/UserContext';

export default function ProfilePage() {
    const { user , setUser } = useUser();
    if (!user) {
        return <h1 className="text-2xl">Loading...</h1>;
    }
    
    const attributes = [
        { label: "Name", value: user.first_name + " " + user.last_name },
        { label: "Email", value: user.email },
        { label: "Date of birth", value: user.date_of_birth },
        { label: "Role", value: user.role },
        { label: "Gender", value: user.gender },
    ];

    return (
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-4xl">Profile</h1>
            {/* Profile details go here */}
            {user ? (
                <div className='flex flex-col gap-4 mt-8 justify-start'>
                    {attributes.map((attr) => (
                        <div className="flex flex-row" key={attr.label}>
                            <h2>{attr.label} : </h2>
                            <h2>{attr.value}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>No user information available</h1>
            )}
        </div>
    );
}
