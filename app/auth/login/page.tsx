import { Suspense } from "react";
import LoginPage from "./LoginPage";
import AuthSkeleton from "../AuthSkeleton";

export default function Page() {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <LoginPage />
    </Suspense>
  );
}
