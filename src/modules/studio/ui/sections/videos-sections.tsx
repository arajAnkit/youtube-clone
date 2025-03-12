"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";

import { Globe2Icon, LockIcon } from "lucide-react";

import { format } from "date-fns";
import { snakeCaseToTitle } from "@/lib/utils";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="border-y border-gray-300 bg-gray-50">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="pl-6 w-[510px] text-gray-600">
                Video
              </TableHead>
              <TableHead className="text-gray-600">Visibility</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-right text-gray-600">Views</TableHead>
              <TableHead className="text-right text-gray-600">
                Comments
              </TableHead>
              <TableHead className="text-right pr-6 text-gray-600">
                Likes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-gray-100">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36 bg-gray-300 rounded-md" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px] bg-gray-300 rounded-sm" />
                      <Skeleton className="h-3 w-[150px] bg-gray-300 rounded-sm" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24 bg-gray-300 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto bg-gray-300 rounded-sm" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto bg-gray-300 rounded-sm" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="h-4 w-12 ml-auto bg-gray-300 rounded-sm" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  href={`/studio/videos/${video.id}`}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4 ">
                        <div className="relative aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            imageUrl={video.thumbnailUrl}
                            previewUrl={video.previewUrl}
                            title={video.title}
                            duration={video.duration || 0}
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden gap-y-1">
                          <span className="text-sm line-clamp-1">
                            {video.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {video.description || "No description"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {video.visibility === "private" ? (
                          <LockIcon className="size-4 mr-2" />
                        ) : (
                          <Globe2Icon className="size-4 mr-2" />
                        )}
                        {snakeCaseToTitle(video.visibility)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {snakeCaseToTitle(video.muxStatus || "error")}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {format(new Date(video.createdAt), "d MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-sm">views</TableCell>
                    <TableCell className="text-right text-sm">
                      comments
                    </TableCell>
                    <TableCell className="text-right text-sm pr-6">
                      likes
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
