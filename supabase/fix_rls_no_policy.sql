-- Fix Security Advisor Info: "RLS Enabled No Policy"
-- credit_ledger, invite_rewards, showcase_likes
-- Run once in Supabase SQL Editor

-- credit_ledger / invite_rewards: read-own; writes stay service-role only
drop policy if exists "credit_ledger_select_own" on credit_ledger;
create policy "credit_ledger_select_own" on credit_ledger for select
  using (auth.uid() = user_id);

drop policy if exists "invite_rewards_select_own" on invite_rewards;
create policy "invite_rewards_select_own" on invite_rewards for select
  using (auth.uid() = inviter_id or auth.uid() = invitee_id);

-- showcase_likes: public read; like/unlike as self
drop policy if exists "showcase_likes_select_anon" on showcase_likes;
drop policy if exists "showcase_likes_insert_auth" on showcase_likes;
drop policy if exists "showcase_likes_delete_own" on showcase_likes;

create policy "showcase_likes_select_anon" on showcase_likes for select using (true);
create policy "showcase_likes_insert_auth" on showcase_likes for insert
  with check (auth.uid() = user_id);
create policy "showcase_likes_delete_own" on showcase_likes for delete
  using (auth.uid() = user_id);
