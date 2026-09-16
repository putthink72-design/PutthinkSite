"use client";

import { APP_STORE_URL, IS_APP_STORE_LIVE } from "@/lib/constants";
import { Logo } from "./AppStoreButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocaleLink } from "./LocaleLink";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";

export function Nav() {
  const { dict, href } = useI18n();
  const [open, setOpen] = useState(false);
  const live = IS_APP_STORE_LIVE;
  const downloadHref = live ? APP_STORE_URL : href("/support");

  const links = [
    { href: "/how-it-works", label: dict.nav.how },
    { href: "/showcase", label: dict.nav.showcase },
    { href: "/hof", label: dict.nav.hof },
    { href: "/pricing", label: dict.nav.pricing },
    { href: "/support", label: dict.nav.support },
  ];

  return (
    <nav className="nav" id="nav">
      <div className="nav-in">
        <Logo href={href("/")} />
        <ul className="nlinks">
          {links.map((l) => (
            <li key={l.href}>
              <LocaleLink href={l.href}>{l.label}</LocaleLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <LanguageSwitcher />
          <a
            className="btn-dl"
            href={downloadHref}
            target={live ? "_blank" : undefined}
            rel={live ? "noopener noreferrer" : undefined}
          >
            {dict.nav.download}
          </a>
        </div>
        <button
          className="burger"
          aria-label={dict.nav.menu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <b />
          <b />
          <b />
        </button>
      </div>
      <div className={`mobile-menu${open ? " open" : ""}`}>
        {links.map((l) => (
          <LocaleLink key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </LocaleLink>
        ))}
        <a
          href={downloadHref}
          target={live ? "_blank" : undefined}
          rel={live ? "noopener noreferrer" : undefined}
          onClick={() => setOpen(false)}
        >
          {dict.nav.download}
        </a>
      </div>
    </nav>
  );
}
