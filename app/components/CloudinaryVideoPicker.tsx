"use client";

import Script from "next/script"; 

type Props = {
  drillId?: number; // optional: only for update mode
  onUploaded?: (payload: { url: string; public_id: string; duration?: number }) => void;
};

async function saveVideo(drillId: number, videoUrl: string) {
  const res = await fetch(`/api/drills/${drillId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json", 
    },
    credentials: "include",
    body: JSON.stringify({ video_url: videoUrl }),
  });

  if (!res.ok) {
    throw new Error("❌ Failed to update drill video");
  }

  return await res.json();
}

export default function CloudinaryVideoPicker({ drillId, onUploaded }: Props) {
  const openWidget = () => {
    // @ts-ignore
    const widget = window.cloudinary?.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        sources: ["local", "url"],
        resourceType: "video",
        multiple: false,
        folder: "drills",
        clientAllowedFormats: ["mp4", "mov", "webm"],
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const payload = {
            url: result.info.secure_url,
            public_id: result.info.public_id,
            duration: result.info.duration,
          };

          console.log("✅ Uploaded:", payload);

          // If we are in edit mode -> update backend directly
          if (drillId) {
            await saveVideo(drillId, payload.url);
          }

          // Always notify parent (create drill will use this)
          if (onUploaded) onUploaded(payload);
        }
      }
    );

    widget?.open();
  };

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />
      <button
        type="button"
        onClick={openWidget}
        className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
      >
        Upload Video
      </button>
    </>
  );
}
