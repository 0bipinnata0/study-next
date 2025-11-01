
import { DEFAULT_LIMIT } from "@/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const { query: rawQuery, categoryId: rawCategoryId } = await searchParams;
  const query = rawQuery ? decodeURI(rawQuery) : undefined
  const categoryId = rawCategoryId ? decodeURI(rawCategoryId) : undefined

  void trpc.categories.getMany.prefetch();
  void trpc.search.getMany.prefetchInfinite({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
}

export default Page;

