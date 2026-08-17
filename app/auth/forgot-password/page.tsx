import { Suspense } from "react";
import AuthSkeleton from "../AuthSkeleton";
import ForgotPasswordPage from "./ForgotPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
