import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";
import AuthSkeleton from "../AuthSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
