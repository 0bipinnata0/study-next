"use client";
import { trpc } from "@/trpc/client";

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "abc",
  });
  return <div>Client component says: {data.greeting}</div>;
};
