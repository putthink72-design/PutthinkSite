"use client";

import { APP_STORE_URL } from "@/lib/constants";
import { Logo } from "./AppStoreButton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocaleLink } from "./LocaleLink";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";

export function Nav() {
  const { dict, href } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/how-it-works", label: dict.nav.how },
    { href: "/showcase", label: dict.nav.showcase },
    { href: "/hof", label: dict.nav.hof },
    { href: "/pricing", label: dict.nav.pricing },
    { href: "/support", label: dict.nav.support },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled || open ? " on" : ""}`} id="nav">
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
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
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
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          {dict.nav.download}
        </a>
      </div>
    </nav>
  );
}
