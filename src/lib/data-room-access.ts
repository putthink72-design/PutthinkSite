import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createServiceClient,
  isApprovedDataRoomEmail,
} from "@/lib/data-room";

/**
 * When Supabase service role is configured, Data Room requires:
 * 1) signed-in session (magic link)
 * 2) matching approved row in data_room_requests
 *
 * Set DATA_ROOM_ALLOW_DEMO_PREVIEW=1 to keep the pre-launch open mock.
 */
export async function requireDataRoomAccess(locale: string): Promise<void> {
  if (process.env.DATA_ROOM_ALLOW_DEMO_PREVIEW === "1") return;

  const sbAdmin = createServiceClient();
  if (!sbAdmin) return; // env not ready — show mock dashboard

  let userEmail: string | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? undefined;
  } catch {
    userEmail = undefined;
  }

  if (!userEmail) {
    redirect(`/${locale}/data-room/request?need=login`);
  }

  const approved = await isApprovedDataRoomEmail(sbAdmin, userEmail);
  if (!approved) {
    redirect(`/${locale}/data-room/request?need=pending`);
  }
}
