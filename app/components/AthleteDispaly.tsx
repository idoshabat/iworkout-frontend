export default function userDisplay({ user }: { user: any }) {
    return (
        <div className="flex flex-col mx-auto w-full justify-center items-center p-4 border rounded bg-gray-400 text-black">
            <div className="w-full text-left">
                <h2 className="font-semibold">user Details:</h2>
                <p>Name: {user.first_name + " " + user.last_name}</p>
                <p>Email: {user.email}</p>
                <p>Age: {new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()}</p>
            </div>
            {/* <p>Height: {user.height}</p> */}
            {/* <p>Weight: {user.weight}</p> */}
        </div>
    );
}
