import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// TODO: Properly impiment video reaction
export const VideoReactions = () => {
  const viewerReaction: "like" | "dislike" = "like";

  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant={"secondary"}
      >
        <ThumbsUpIcon
          className={cn("size-4", viewerReaction === "like" && "fill-black")}
        />
        {1}
      </Button>
      <Separator className="h-7" orientation="vertical" />
      <Button
        className="rounded-l-none rounded-r-full pl-3"
        variant={"secondary"}
      >
        <ThumbsDownIcon
          className={cn("size-4", viewerReaction !== "like" && "fill-black")}
        />
        {1}
      </Button>
    </div>
  );
};
