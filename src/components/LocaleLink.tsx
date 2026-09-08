"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/i18n/provider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Locale-prefixed Link */
export function LocaleLink({ href, ...rest }: Props) {
  const { href: withLocale } = useI18n();
  return <Link href={withLocale(href)} {...rest} />;
}
