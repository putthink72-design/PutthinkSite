"use client";

import { FlagSprite } from "@/components/FlagSprite";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";

const COUNTRY_ROWS = [
  {
    flag: "f-us",
    key: "us" as const,
    dl: "8,240",
    conv: "2.71%",
    paidAll: "223",
    paidActive: "189",
    retention: "85%",
    mrr: "$1,610",
  },
  {
    flag: "f-kr",
    key: "kr" as const,
    dl: "5,120",
    conv: "3.09%",
    paidAll: "158",
    paidActive: "132",
    retention: "84%",
    mrr: "$1,120",
  },
  {
    flag: "f-jp",
    key: "jp" as const,
    dl: "2,010",
    conv: "2.19%",
    paidAll: "44",
    paidActive: "33",
    retention: "75%",
    mrr: "$280",
  },
  {
    flag: "f-ca",
    key: "ca" as const,
    dl: "1,340",
    conv: "2.16%",
    paidAll: "29",
    paidActive: "22",
    retention: "76%",
    mrr: "$185",
  },
  {
    flag: "f-gb",
    key: "gb" as const,
    dl: "980",
    conv: "1.94%",
    paidAll: "19",
    paidActive: "14",
    retention: "74%",
    mrr: "$120",
  },
  {
    flag: "f-au",
    key: "au" as const,
    dl: "512",
    conv: "2.15%",
    paidAll: "11",
    paidActive: "8",
    retention: "73%",
    mrr: "$68",
  },
  {
    flag: "f-de",
    key: "de" as const,
    dl: "230",
    conv: "1.74%",
    paidAll: "4",
    paidActive: "3",
    retention: "75%",
    mrr: "$25",
  },
];

const NAMES = {
  ko: { us: "미국", kr: "한국", jp: "일본", ca: "캐나다", gb: "영국", au: "호주", de: "독일" },
  en: {
    us: "United States",
    kr: "Korea",
    jp: "Japan",
    ca: "Canada",
    gb: "United Kingdom",
    au: "Australia",
    de: "Germany",
  },
  ja: {
    us: "アメリカ",
    kr: "韓国",
    jp: "日本",
    ca: "カナダ",
    gb: "イギリス",
    au: "オーストラリア",
    de: "ドイツ",
  },
};

export function Dashboard({ email = "investor@example-fund.com" }: { email?: string }) {
  const { dict, locale } = useI18n();
  const t = dict.dataRoom;
  const names = NAMES[locale];
  const initials = email.split("@")[0].slice(0, 2).toUpperCase();
  const [m4, m5, m6, m7, m8, m9] = t.months;

  return (
    <div className="dash">
      <FlagSprite />
      <div className="dtop">
        <div className="dtop-in">
          <div className="dbrand">
            <span className="dot" />
            Putthink
            <span className="tag">DATA ROOM</span>
          </div>
          <div className="duser">
            <LanguageSwitcher />
            <span>{email}</span>
            <div className="avatar">{initials}</div>
            <LocaleLink className="dsignout" href="/data-room/request">
              {t.signOut}
            </LocaleLink>
          </div>
        </div>
      </div>

      <div className="dr-shell">
        <div className="dhead">
          <h1>{t.dashTitle}</h1>
          <p>{t.dashSub}</p>
          <div className="sync">
            <span className="d" />
            {t.lastSync}
          </div>
          <div className="mock-badge">{t.mockBadge}</div>
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="k">{t.kpiDownloads}</div>
            <div className="v dr-num">18,432</div>
            <div className="d">↑ 12.4% WoW</div>
          </div>
          <div className="kpi">
            <div className="k">{t.kpiMau}</div>
            <div className="v dr-num">6,105</div>
            <div className="d">↑ 8.1% WoW</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiConv}
              <span className="hint">{t.kpiConvHint}</span>
            </div>
            <div className="v dr-num">2.65%</div>
            <div className="d">↑ 0.15%p</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiConv30}
              <span className="hint">{t.kpiConv30Hint}</span>
            </div>
            <div className="v dr-num">3.2%</div>
            <div className="d">↑ 0.6%p</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiPaidAll}
              <span className="hint">{t.kpiPaidAllHint}</span>
            </div>
            <div className="v dr-num">488</div>
            <div className="d">↑ 9.3% MoM</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiPaidActive}
              <span className="hint">{t.kpiPaidActiveHint}</span>
            </div>
            <div className="v dr-num">401</div>
            <div className="d">↑ 6.7% MoM</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiRetention}
              <span className="hint">{t.kpiRetentionHint}</span>
            </div>
            <div className="v dr-num">82%</div>
            <div className="d down">↓ 1.1%p</div>
          </div>
          <div className="kpi">
            <div className="k">
              {t.kpiMrr}
              <span className="hint">{t.kpiMrrHint}</span>
            </div>
            <div className="v dr-num">$3,410</div>
            <div className="d">↑ 11.2% MoM</div>
          </div>
        </div>
        <p className="kpi-note">{t.kpiFootnote}</p>

        <div className="chartrow">
          <div className="dr-card">
            <div className="card-head">
              <h3>{t.chartMrr}</h3>
              <span className="sub">{t.chartMrrSub}</span>
            </div>
            <svg viewBox="0 0 560 180" width="100%" height="180" preserveAspectRatio="none">
              <g stroke="#EFEFEA" strokeWidth="1">
                <path d="M0 30H560M0 75H560M0 120H560M0 165H560" />
              </g>
              <path
                d="M20 150 L110 138 L200 132 L290 108 L380 78 L470 46 L550 20"
                fill="none"
                stroke="#FFB020"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 150 L110 138 L200 132 L290 108 L380 78 L470 46 L550 20 L550 178 L20 178 Z"
                fill="#FFB020"
                opacity=".08"
              />
              <g fill="#E5960F">
                <circle cx="20" cy="150" r="3.4" />
                <circle cx="110" cy="138" r="3.4" />
                <circle cx="200" cy="132" r="3.4" />
                <circle cx="290" cy="108" r="3.4" />
                <circle cx="380" cy="78" r="3.4" />
                <circle cx="470" cy="46" r="3.4" />
                <circle cx="550" cy="20" r="3.6" />
              </g>
              <g fontFamily="Pretendard" fontSize="11" fill="#9BA09A">
                <text x="20" y="176" textAnchor="middle">
                  {m4}
                </text>
                <text x="110" y="176" textAnchor="middle">
                  {m5}
                </text>
                <text x="200" y="176" textAnchor="middle">
                  {m6}
                </text>
                <text x="290" y="176" textAnchor="middle">
                  {m7}
                </text>
                <text x="380" y="176" textAnchor="middle">
                  {m8}
                </text>
                <text x="470" y="176" textAnchor="middle">
                  {m9}
                </text>
              </g>
            </svg>
          </div>

          <div className="dr-card">
            <div className="card-head">
              <h3>{t.chartCountry}</h3>
              <span className="sub">{t.chartCountrySub}</span>
            </div>
            <svg viewBox="0 0 300 180" width="100%" height="180">
              <g fontFamily="Pretendard" fontSize="11.5" fill="#3D423D">
                <text x="0" y="14">
                  {names.us}
                </text>
                <rect x="46" y="3" width="200" height="14" rx="3" fill="#FFB020" />
                <text x="252" y="14" fill="#9BA09A">
                  8,240
                </text>
                <text x="0" y="42">
                  {names.kr}
                </text>
                <rect x="46" y="31" width="128" height="14" rx="3" fill="#FFCE73" />
                <text x="180" y="42" fill="#9BA09A">
                  5,120
                </text>
                <text x="0" y="70">
                  {names.jp}
                </text>
                <rect x="46" y="59" width="56" height="14" rx="3" fill="#FFE2A8" />
                <text x="108" y="70" fill="#9BA09A">
                  2,010
                </text>
                <text x="0" y="98">
                  {names.ca}
                </text>
                <rect x="46" y="87" width="38" height="14" rx="3" fill="#FFE2A8" />
                <text x="90" y="98" fill="#9BA09A">
                  1,340
                </text>
                <text x="0" y="126">
                  {names.gb}
                </text>
                <rect x="46" y="115" width="28" height="14" rx="3" fill="#FFE2A8" />
                <text x="80" y="126" fill="#9BA09A">
                  980
                </text>
                <text x="0" y="154">
                  {t.chartOther}
                </text>
                <rect x="46" y="143" width="22" height="14" rx="3" fill="#FFE2A8" />
                <text x="74" y="154" fill="#9BA09A">
                  742
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div className="dr-card" style={{ marginBottom: 14 }}>
          <div className="card-head">
            <h3>{t.tableTitle}</h3>
            <span className="sub">{t.tableSub}</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>{t.colCountry}</th>
                <th className="num">{t.colDownloads}</th>
                <th className="num">{t.colConv}</th>
                <th className="num">{t.colPaidAll}</th>
                <th className="num">{t.colPaidActive}</th>
                <th className="num">{t.colRetention}</th>
                <th className="num">{t.colMrr}</th>
              </tr>
            </thead>
            <tbody>
              {COUNTRY_ROWS.map((c) => (
                <tr key={c.key}>
                  <td>
                    <div className="country">
                      <svg className="flag">
                        <use href={`#${c.flag}`} />
                      </svg>
                      {names[c.key]}
                    </div>
                  </td>
                  <td className="num">{c.dl}</td>
                  <td className="num">{c.conv}</td>
                  <td className="num">{c.paidAll}</td>
                  <td className="num">{c.paidActive}</td>
                  <td className="num">{c.retention}</td>
                  <td className="num">{c.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-head" style={{ marginTop: 30 }}>
          <h3 style={{ fontSize: 16 }}>{t.assetsTitle}</h3>
        </div>
        <div className="assets">
          <div className="asset">
            <div className="ico">P</div>
            <h4>{t.assetP}</h4>
            <p>{t.assetPBody}</p>
            <a href="#">{t.download}</a>
          </div>
          <div className="asset">
            <div className="ico">R</div>
            <h4>{t.assetR}</h4>
            <p>{t.assetRBody}</p>
            <a href="#">{t.download}</a>
          </div>
          <div className="asset">
            <div className="ico">C</div>
            <h4>{t.assetC}</h4>
            <p>{t.assetCBody}</p>
            <a href="#">{t.requestAccess}</a>
          </div>
          <div className="asset">
            <div className="ico">V</div>
            <h4>{t.assetV}</h4>
            <p>{t.assetVBody}</p>
            <a href="#">{t.download}</a>
          </div>
        </div>

        <div className="dfooter">
          <p>{t.meetHint}</p>
          <a className="meet-btn" href="mailto:hello@nasem.kr">
            {t.meetCta}
          </a>
        </div>
      </div>
      <div style={{ height: 60 }} />
    </div>
  );
}
