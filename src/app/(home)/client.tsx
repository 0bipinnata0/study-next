"use client";
import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();
  return <div>Client component says: {JSON.stringify(data)}</div>;
};
