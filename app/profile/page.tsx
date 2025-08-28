// app/profile/page.tsx
import { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <ProfileContent />
    </Suspense>
  );
}
