import { Suspense } from "react";
import VerifyOTPPage from "./VerifyOTPPage";
import AuthSkeleton from "../AuthSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <VerifyOTPPage />
    </Suspense>
  );
}
