"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatHoleLocation } from "@/lib/mock-data";
import type { LiveShowcaseCard } from "@/lib/showcase-data";
import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { VideoThumb } from "@/components/VideoThumb";

export function ShowcaseCardView({
  item: initial,
}: {
  item: LiveShowcaseCard;
}) {
  const { dict } = useI18n();
  const t = dict.showcase;
  const { user, requestLogin, pendingLikeId, clearPendingLike } = useAuth();
  const [item, setItem] = useState(initial);
  const [liking, setLiking] = useState(false);
  const ranPending = useRef(false);

  useEffect(() => setItem(initial), [initial]);

  const toggleLike = useCallback(async () => {
    if (!user) {
      requestLogin({ pendingLikeId: item.isLive ? item.id : undefined });
      return;
    }
    // Mock feed: local-only toggle so the control isn’t dead before DB rows exist
    if (!item.isLive) {
      setItem((prev) => {
        const nextLiked = !prev.likedByMe;
        const likesCount = Math.max(0, prev.likesCount + (nextLiked ? 1 : -1));
        return {
          ...prev,
          likedByMe: nextLiked,
          likesCount,
          likes: likesCount.toLocaleString("en-US"),
        };
      });
      return;
    }
    setLiking(true);
    try {
      const supabase = createClient();
      const nextLiked = !item.likedByMe;
      if (nextLiked) {
        const { error } = await supabase.from("showcase_likes").insert({
          showcase_id: item.id,
          user_id: user.id,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("showcase_likes")
          .delete()
          .eq("showcase_id", item.id)
          .eq("user_id", user.id);
        if (error) throw error;
      }
      const { data: row } = await supabase
        .from("putt_showcase")
        .select("likes_count")
        .eq("id", item.id)
        .single();
      const likesCount =
        row?.likes_count ?? item.likesCount + (nextLiked ? 1 : -1);
      setItem((prev) => ({
        ...prev,
        likedByMe: nextLiked,
        likesCount,
        likes: likesCount.toLocaleString("en-US"),
      }));
    } catch {
      /* keep prior state */
    } finally {
      setLiking(false);
    }
  }, [item.id, item.isLive, item.likedByMe, item.likesCount, user, requestLogin]);

  useEffect(() => {
    if (!user || !item.isLive || ranPending.current) return;
    if (pendingLikeId !== item.id) return;
    ranPending.current = true;
    clearPendingLike();
    void toggleLike();
  }, [user, item.id, item.isLive, pendingLikeId, clearPendingLike, toggleLike]);

  return (
    <article className="card">
      <div className="card-v">
        {item.videoUrl ? (
          <VideoThumb
            className="card-video"
            src={item.videoUrl}
            controls
          />
        ) : null}
        {item.rank ? <div className="rank">{item.rank}</div> : null}
        <div className="meta">
          <span className="chip hot">{t.cats[item.category]}</span>
        </div>
      </div>
      <div className="card-b">
        <div className="u">
          <div className="av" />
          <div className="un">{item.nickname}</div>
        </div>
        <div className="ct">{item.caption}</div>
        <div className="lk">
          <span>
            {formatHoleLocation(
              item.clubName,
              item.courseName,
              item.holeNumber,
              t.holeUnit,
            )}
          </span>
          <button
            type="button"
            className={`like-btn${item.likedByMe ? " on" : ""}`}
            disabled={liking}
            aria-pressed={item.likedByMe}
            onClick={() => void toggleLike()}
          >
            <span className="like-heart" aria-hidden="true">
              {item.likedByMe ? "♥" : "♡"}
            </span>
            <b>{item.likes}</b> {t.likes}
          </button>
        </div>
        {item.isLive ? (
          <p style={{ marginTop: 10, fontSize: 12 }}>
            <LocaleLink
              href="/support#contact"
              style={{ color: "var(--g-2)", textDecoration: "underline" }}
            >
              {t.report}
            </LocaleLink>
          </p>
        ) : null}
      </div>
    </article>
  );
}
