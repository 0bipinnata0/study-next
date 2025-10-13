// import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
// import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
// import { trpc } from "@/trpc/client";

// import type { VideoGetOneOutput } from "../../types";

// interface VideoReactionsProps {
//   videoId: string;
//   likes: number;
//   dislikes: number;
//   viewerReaction: VideoGetOneOutput["viewerReaction"];
// }

// export const VideoReactions = ({
//   videoId,
//   likes,
//   dislikes,
//   viewerReaction,
// }: VideoReactionsProps) => {

export const VideoReactions = () => {
  // const clerk = useClerk();
  // const utils = trpc.useUtils();

  // const like = trpc.videoReactions.like.useMutation({
  //   onSuccess: () => {
  //     utils.videos.getOne.invalidate({ id: videoId });
  //     utils.playlists.getLiked.invalidate();
  //   },
  //   onError: (error) => {
  //     toast.error("Something went wrong");

  //     if (error.data?.code === "UNAUTHORIZED") {
  //       clerk.openSignIn();
  //     }
  //   }
  // });

  // const dislike = trpc.videoReactions.dislike.useMutation({
  //   onSuccess: () => {
  //     utils.videos.getOne.invalidate({ id: videoId });
  //     utils.playlists.getLiked.invalidate();
  //   },
  //   onError: (error) => {
  //     toast.error("Something went wrong");

  //     if (error.data?.code === "UNAUTHORIZED") {
  //       clerk.openSignIn();
  //     }
  //   }
  // });
  const viewerReaction: "like" | "dislike" =
    Math.random() > 0.3 ? "like" : "dislike";

  return (
    <div className="flex items-center flex-none">
      <Button
        // onClick={() => like.mutate({ videoId })}
        // disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {/* {likes} */}
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        // onClick={() => dislike.mutate({ videoId })}
        // disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {/* {dislikes} */}
        {1}
      </Button>
    </div>
  );
};
