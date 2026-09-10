import type { ShowcaseCategory, ShowcaseCard, HofCard } from "@/lib/mock-data";
import { MOCK_HOF, MOCK_SHOWCASE } from "@/lib/mock-data";

export type LiveShowcaseCard = ShowcaseCard & {
  videoUrl: string | null;
  likesCount: number;
  likedByMe: boolean;
  /** false = mock fallback (likes disabled) */
  isLive: boolean;
};

export type LiveHofCard = HofCard & {
  videoUrl: string | null;
  likesCount: number;
  isLive: boolean;
};

function formatLikes(n: number): string {
  return n.toLocaleString("en-US");
}

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

type ShowcaseRow = {
  id: string;
  category: ShowcaseCategory;
  nickname: string;
  caption: string;
  club_name: string;
  course_name: string;
  hole_number: number;
  likes_count: number;
  video_url: string | null;
  created_at: string;
};

function mapShowcase(
  row: ShowcaseRow,
  likedByMe = false,
  rank?: string,
): LiveShowcaseCard {
  return {
    id: row.id,
    category: row.category,
    nickname: row.nickname,
    caption: row.caption,
    clubName: row.club_name,
    courseName: row.course_name,
    holeNumber: row.hole_number,
    likes: formatLikes(row.likes_count),
    likesCount: row.likes_count,
    videoUrl: row.video_url,
    likedByMe,
    isLive: true,
    rank,
  };
}

function mockShowcase(): LiveShowcaseCard[] {
  return MOCK_SHOWCASE.map((m) => ({
    ...m,
    videoUrl: null,
    likesCount: Number(m.likes.replace(/,/g, "")) || 0,
    likedByMe: false,
    isLive: false,
  }));
}

function mockHof(): LiveHofCard[] {
  return MOCK_HOF.map((m) => ({
    ...m,
    videoUrl: null,
    likesCount: Number(m.likes.replace(/,/g, "")) || 0,
    isLive: false,
  }));
}

export async function fetchShowcaseFeed(opts?: {
  userId?: string | null;
  limit?: number;
}): Promise<LiveShowcaseCard[]> {
  if (!hasSupabaseEnv()) return mockShowcase().slice(0, opts?.limit);

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let q = supabase
      .from("putt_showcase")
      .select(
        "id, category, nickname, caption, club_name, course_name, hole_number, likes_count, video_url, created_at",
      )
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false });

    if (opts?.limit) q = q.limit(opts.limit);

    const { data, error } = await q;
    if (error || !data?.length) return mockShowcase().slice(0, opts?.limit);

    let likedIds = new Set<string>();
    if (opts?.userId) {
      const { data: likes } = await supabase
        .from("showcase_likes")
        .select("showcase_id")
        .eq("user_id", opts.userId)
        .in(
          "showcase_id",
          data.map((r) => r.id),
        );
      likedIds = new Set((likes ?? []).map((l) => l.showcase_id as string));
    }

    return (data as ShowcaseRow[]).map((row, i) =>
      mapShowcase(
        row,
        likedIds.has(row.id),
        i === 0 ? undefined : undefined,
      ),
    );
  } catch {
    return mockShowcase().slice(0, opts?.limit);
  }
}

export async function fetchHallOfFame(opts?: {
  limit?: number;
}): Promise<LiveHofCard[]> {
  if (!hasSupabaseEnv()) return mockHof().slice(0, opts?.limit);

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let q = supabase
      .from("hall_of_fame")
      .select(
        `
        id,
        period,
        putt_showcase (
          id,
          category,
          nickname,
          caption,
          club_name,
          course_name,
          hole_number,
          likes_count,
          video_url
        )
      `,
      )
      .order("period", { ascending: false });

    if (opts?.limit) q = q.limit(opts.limit);

    const { data, error } = await q;
    if (error || !data?.length) return mockHof().slice(0, opts?.limit);

    return data
      .map((row) => {
        const s = row.putt_showcase as ShowcaseRow | ShowcaseRow[] | null;
        const showcase = Array.isArray(s) ? s[0] : s;
        if (!showcase) return null;
        const period = String(row.period).slice(0, 7).replace("-", ".");
        return {
          id: showcase.id,
          period,
          category: showcase.category,
          nickname: showcase.nickname,
          caption: showcase.caption,
          clubName: showcase.club_name,
          courseName: showcase.course_name,
          holeNumber: showcase.hole_number,
          likes: formatLikes(showcase.likes_count),
          likesCount: showcase.likes_count,
          videoUrl: showcase.video_url,
          isLive: true,
        } satisfies LiveHofCard;
      })
      .filter(Boolean) as LiveHofCard[];
  } catch {
    return mockHof().slice(0, opts?.limit);
  }
}

export async function getSessionUserId(): Promise<string | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
