"use client";

import { useCallback, useEffect, useState } from "react";

import { BOOKMARKS_STORAGE_KEY } from "@/lib/constants";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setBookmarks(parsed.filter((id) => typeof id === "string"));
        }
      }
    } catch {
      setBookmarks([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks, ready]);

  const isBookmarked = useCallback(
    (noticeId: string) => bookmarks.includes(noticeId),
    [bookmarks]
  );

  const toggleBookmark = useCallback((noticeId: string) => {
    setBookmarks((current) =>
      current.includes(noticeId)
        ? current.filter((id) => id !== noticeId)
        : [...current, noticeId]
    );
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, ready };
}
