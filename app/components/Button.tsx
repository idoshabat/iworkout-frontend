export default function Button({
    onClick,
    type,
    children,
}: {
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-4 py-2 cursor-pointer bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
            {children}
        </button>
    );
}