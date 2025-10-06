import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";
import { PageClient } from "./client";

export default async function Home() {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>error...</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <PageClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
