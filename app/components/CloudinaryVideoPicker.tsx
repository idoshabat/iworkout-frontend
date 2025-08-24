// app/components/CloudinaryVideoPicker.tsx
'use client';

import Script from "next/script";

type Props = {
    onUploaded: (payload: { url: string; public_id: string; duration?: number }) => void;
};

export default function CloudinaryVideoPicker({ onUploaded }: Props) {
    const openWidget = () => {
        // @ts-ignore
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                // Tell the widget to fetch a signature from your backend:
                uploadSignature: async (
                    callback: (signature: string) => void,
                    paramsToSign: Record<string, string>
                ): Promise<void> => {
                    const res: Response = await fetch("/users/cloudinary/sign/", {
                        method: "POST",
                        body: new URLSearchParams(paramsToSign), // the widget sends params to sign
                    });
                    const data: { signature: string } = await res.json();
                    callback(data.signature);
                },
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, // expose API key is fine
                folder: "drills",
                resourceType: "video",
                multiple: false,
            }
        );

        widget?.open();
    };

    return (
        <>
            <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
            <button type="button" onClick={openWidget} className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800">
                Upload Video
            </button>
        </>
    );
}
