"use client";

import Link from "next/link";
import { APP_STORE_URL, IS_APP_STORE_LIVE } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";

export function AppStoreButton({ href }: { href?: string }) {
  const { dict, href: localeHref } = useI18n();
  const live = IS_APP_STORE_LIVE;
  const target = href ?? (live ? APP_STORE_URL : localeHref("/support"));

  return (
    <a
      className="appstore"
      href={target}
      target={live ? "_blank" : undefined}
      rel={live ? "noopener noreferrer" : undefined}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.05 12.53c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.5zM14.88 5.9c.6-.74 1.01-1.75.9-2.77-.87.04-1.93.58-2.56 1.31-.56.65-1.06 1.7-.93 2.7.97.08 1.97-.5 2.59-1.24z" />
      </svg>
      <div>
        <span>{live ? dict.appStore.downloadOn : dict.nav.download}</span>
        <strong>{live ? dict.appStore.appStore : dict.appStore.comingSoon}</strong>
      </div>
    </a>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      className="logo"
      href={href}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <i aria-hidden="true" />
      Putthink
    </Link>
  );
}
