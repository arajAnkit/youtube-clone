import Link from "next/link";

import { useAuth } from "@clerk/nextjs";

import { VideoGetOneOutput } from "../../types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


import { UserAvatar } from "@/components/user-avatar";

import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}
export const VideoOwnerSkeleton = () => {
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-between gap-3 min-w-0">
      {/* User Avatar and Info Skeleton */}
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar Skeleton */}
        <div className="flex flex-col gap-1 min-w-0">
          <Skeleton className="h-4 w-32" /> {/* User Name Skeleton */}
          <Skeleton className="h-3 w-20" /> {/* Subscriber Count Skeleton */}
        </div>
      </div>

      {/* Button/Subscription Skeleton */}
      <Skeleton className="h-8 w-24 rounded-full flex-none" />
    </div>
  );
};
export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-between gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};
