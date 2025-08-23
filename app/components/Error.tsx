export default function Error({ message }: { message: string }) {
    return (
        <div className="mt-4 text-red-500">
            {message}
        </div>
    );
}
