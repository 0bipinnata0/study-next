import type { NextPage } from "next";
import { trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {}

const Page: NextPage<PageProps> = async ({}) => {
  void trpc.categories.getMany.prefetch();
  return <div>studio</div>;
};

export default Page;
