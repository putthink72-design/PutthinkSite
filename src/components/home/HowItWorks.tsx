"use client";

import { useI18n } from "@/i18n/provider";

export function HowItWorks() {
  const { dict } = useI18n();
  const t = dict.how;

  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h2>
          <p className="sub">{t.sub}</p>
        </div>

        <div className="bento">
          <div className="bx">
            <div className="num">{t.scanNum}</div>
            <h3>{t.scanTitle}</h3>
            <p>{t.scanBody}</p>
            <div className="bx-viz">
              <svg viewBox="0 0 340 130" style={{ width: "100%", height: "auto" }}>
                <rect width="340" height="130" fill="#0C0C0C" />
                <g stroke="#2A2A2A" strokeWidth="1">
                  <path d="M0 32H340M0 65H340M0 98H340M56 0V130M113 0V130M170 0V130M227 0V130M284 0V130" />
                </g>
                <g fill="none" stroke="#FFB020" strokeWidth="1.5" opacity=".9">
                  <path d="M26 100Q90 58 170 72T314 40" />
                  <path d="M26 84Q90 44 170 56T314 26" />
                </g>
                <circle cx="52" cy="96" r="4.5" fill="#F3F1EB" />
                <circle
                  cx="292"
                  cy="34"
                  r="6"
                  fill="none"
                  stroke="#F3F1EB"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
          </div>

          <div className="bx wide">
            <div className="num">{t.aimNum}</div>
            <h3>{t.aimTitle}</h3>
            <p>{t.aimBody}</p>
            <div className="bx-viz">
              <svg viewBox="0 0 700 150" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#9CBB76" />
                    <stop offset=".55" stopColor="#4A7A38" />
                    <stop offset="1" stopColor="#1B3220" />
                  </linearGradient>
                </defs>
                <rect width="700" height="150" fill="url(#gr)" />
                <line
                  x1="150"
                  y1="132"
                  x2="430"
                  y2="34"
                  stroke="#FFB020"
                  strokeWidth="20"
                  strokeLinecap="round"
                  opacity=".18"
                />
                <line
                  x1="150"
                  y1="132"
                  x2="430"
                  y2="34"
                  stroke="#FFB020"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="132" r="6" fill="#fff" />
                <circle
                  cx="470"
                  cy="26"
                  r="7.5"
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                />
                <g
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="12"
                  fill="#0A0A0A"
                  fontWeight="500"
                >
                  <text x="446" y="52">
                    β 10.4°
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="bx full">
            <div className="num">{t.strokeNum}</div>
            <h3>{t.strokeTitle}</h3>
            <p>{t.strokeBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
