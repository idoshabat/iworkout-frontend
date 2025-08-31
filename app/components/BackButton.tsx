'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
    text?: string
}

export default function BackButton({ text = "Back" }: BackButtonProps) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-200 
                                 hover:bg-gray-700 hover:text-white transition-all shadow-md 
                                 border border-gray-700 hover:border-indigo-500 mt-4 cursor-pointer"
        >
            <ArrowLeft size={18} />
            <span className="font-medium">{text}</span>
        </button>
    )
}
