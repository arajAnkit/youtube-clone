import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { trpc } from "@/trpc/client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { VideoGetOneOutput } from "../../types";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  dislikes,
  likes,
  videoId,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: Invalidate "liked" playlist
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: Invalidate "liked" playlist
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant={"secondary"}
      >
        <ThumbsUpIcon
          className={cn("size-4", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator className="h-7" orientation="vertical" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        className="rounded-l-none rounded-r-full pl-3"
        variant={"secondary"}
      >
        <ThumbsDownIcon
          className={cn("size-4", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
