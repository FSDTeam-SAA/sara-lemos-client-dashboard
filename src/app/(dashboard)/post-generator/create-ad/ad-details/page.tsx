import { Suspense } from "react";
import AdDetailsPage from "@/components/Dashboard/ContentGenerator1/AdDetailsPage/AdDetailsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AdDetailsPage />
    </Suspense>
  );
}
