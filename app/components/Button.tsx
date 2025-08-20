export default function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 cursor-pointer bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
        >
            {children}
        </button>
    );
}