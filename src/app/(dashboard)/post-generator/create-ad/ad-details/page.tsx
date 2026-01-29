import { Suspense } from "react";
import AdDetailsPage from "@/components/Dashboard/PostGenerator/AdDetailsPage/AdDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AdDetailsPage />
    </Suspense>
  );
}
