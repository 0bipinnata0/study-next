import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PageClient } from "./client";

export default async function Home() {
  void trpc.hello.prefetch({ text: "abc" });
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
