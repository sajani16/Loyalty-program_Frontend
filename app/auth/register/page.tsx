import { Suspense } from "react";
import RegisterPage from "./RegisterPage";
import AuthSkeleton from "../AuthSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <RegisterPage />
    </Suspense>
  );
}
