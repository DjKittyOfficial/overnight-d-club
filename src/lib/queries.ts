import { queryOptions } from "@tanstack/react-query";
import { getAnnouncement, getSiteSettings, listAnnouncements } from "@/lib/public.functions";

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000,
});

export const announcementsQuery = (limit?: number) =>
  queryOptions({
    queryKey: ["announcements", limit ?? "all"],
    queryFn: () => listAnnouncements({ data: limit ? { limit } : {} }),
    staleTime: 30_000,
  });

export const announcementQuery = (id: string) =>
  queryOptions({
    queryKey: ["announcement", id],
    queryFn: () => getAnnouncement({ data: { id } }),
  });
