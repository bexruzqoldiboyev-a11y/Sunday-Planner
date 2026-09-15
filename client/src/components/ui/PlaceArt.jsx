/**
 * Joylar uchun jonli sahna (illustratsiya + harakat).
 *
 * Nega tashqi rasm/video emas:
 *  1. Demo joylar shartli — ularga internetdagi begona binolar fotosini qoʻyish
 *     foydalanuvchini chalgʻitadi.
 *  2. Tashqi fayl har doim ham yuklanmaydi (tarmoq, CSP, limit) — sahifada
 *     "singan rasm" chiqadi.
 * Shuning uchun har bir kategoriya uchun oʻz sahnamiz bor va u harakatlanadi:
 * bugʻ koʻtariladi, gʻildirak aylanadi, toʻlqin suriladi.
 *
 * Real fotosurat qoʻshmoqchi boʻlsangiz — services/media.js ga qarang:
 * u yerda rasm boʻlsa shu sahna avtomatik fon boʻlib qoladi.
 */

const PALETTES = {
  kino: ['#1B1040', '#4B2E8F', '#FFD166'],
  kafe: ['#2E1A10', '#8A4F2A', '#FFD9A0'],
  breakfast: ['#33220F', '#B07433', '#FFE3A3'],
  restoran: ['#35121A', '#B23A54', '#FFC46B'],
  park: ['#0C2F26', '#1F8A5C', '#C6F06B'],
  sayr: ['#131A3C', '#3C55C8', '#FFC9DE'],
  gaming: ['#120C2B', '#5A3FD6', '#22D3BE'],
  sport: ['#0A2433', '#1E6FA8', '#9CFF6B'],
  shopping: ['#2E0F35', '#A83A6B', '#FFD166'],
  muzey: ['#241708', '#9A6A2E', '#F2E3C6'],
  photo: ['#121527', '#3F4AA8', '#FF9BC2'],
  bowling: ['#1D1030', '#6B45C4', '#FFD166'],
  karaoke: ['#310C27', '#B83279', '#FFD166'],
  swimming: ['#052538', '#1583AC', '#8BE9FF'],
  tabiat: ['#14213C', '#3C5EB8', '#FFB020'],
  entertainment: ['#2F0C28', '#B83E63', '#FFD166'],
};

function palette(key) {
  return PALETTES[key] || ['#1B1530', '#5A3FD6', '#FFB020'];
}

/** Umumiy fon: osmon, yorugʻlik dogʻi, pastki qatlam. */
function Backdrop({ c }) {
  const [, main, accent] = c;
  return (
    <g>
      <circle cx="318" cy="46" r="86" fill={accent} opacity="0.16" />
      <circle cx="70" cy="200" r="96" fill={main} opacity="0.25" />
    </g>
  );
}

function Scene({ category, c }) {
  const [deep, main, accent] = c;

  switch (category) {
    /* ------------------------------- KINO ------------------------------- */
    case 'kino':
      return (
        <g>
          <polygon points="200,150 60,58 340,58" fill={accent} opacity="0.16" className="art-glow" />
          <rect x="64" y="30" width="272" height="106" rx="10" fill={deep} />
          <rect x="76" y="40" width="248" height="86" rx="6" fill={accent} className="art-glow" />
          <circle cx="150" cy="83" r="21" fill={main} opacity="0.8" />
          <path d="M143 72l26 11-26 11z" fill={deep} />
          <rect x="232" y="62" width="70" height="10" rx="5" fill={main} opacity="0.55" />
          <rect x="232" y="82" width="46" height="10" rx="5" fill={main} opacity="0.4" />
          <g fill={deep}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x={12 + i * 56} y="168" width="46" height="40" rx="12" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={`b${i}`} x={40 + i * 56} y="196" width="46" height="34" rx="12" opacity="0.85" />
            ))}
          </g>
          <rect x="176" y="148" width="48" height="16" rx="6" fill={main} />
        </g>
      );

    /* ------------------------------- KAFE ------------------------------- */
    case 'kafe':
    case 'breakfast':
      return (
        <g>
          <circle cx="322" cy="52" r="26" fill={accent} opacity="0.55" className="art-float" />
          <g fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" opacity="0.85">
            <path className="art-steam" d="M160 92c12-14-10-24 0-38" />
            <path className="art-steam" d="M198 86c12-14-10-24 0-38" />
            <path className="art-steam" d="M236 92c12-14-10-24 0-38" />
          </g>
          <path d="M126 104h146v40a46 46 0 0 1-46 46h-54a46 46 0 0 1-46-46z" fill={accent} />
          <path d="M136 112h126v16H136z" fill={main} opacity="0.35" />
          <path
            d="M272 116h20a26 26 0 0 1 0 52h-20"
            fill="none"
            stroke={accent}
            strokeWidth="11"
            strokeLinecap="round"
          />
          <rect x="96" y="196" width="208" height="13" rx="6" fill={main} />
          {category === 'breakfast' ? (
            <g>
              <ellipse cx="330" cy="176" rx="42" ry="20" fill={main} opacity="0.6" />
              <circle cx="330" cy="170" r="15" fill={accent} />
            </g>
          ) : null}
        </g>
      );

    /* ----------------------------- RESTORAN ----------------------------- */
    case 'restoran':
      return (
        <g>
          <g className="art-sway" style={{ transformOrigin: 'top center' }}>
            <path d="M200 0v40" stroke={accent} strokeWidth="4" />
            <path d="M170 40h60l14 30h-88z" fill={accent} opacity="0.9" />
            <circle cx="200" cy="78" r="9" fill={accent} opacity="0.5" className="art-glow" />
          </g>
          <g fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" opacity="0.8">
            <path className="art-steam" d="M180 120c10-12-8-20 0-32" />
            <path className="art-steam" d="M222 120c10-12-8-20 0-32" />
          </g>
          <ellipse cx="200" cy="164" rx="70" ry="26" fill={main} opacity="0.45" />
          <ellipse cx="200" cy="158" rx="62" ry="22" fill={accent} />
          <ellipse cx="200" cy="156" rx="40" ry="14" fill={main} opacity="0.5" />
          <g stroke={accent} strokeWidth="8" strokeLinecap="round">
            <path d="M96 116v78" />
            <path d="M80 116v28a16 16 0 0 0 32 0v-28" />
            <path d="M306 116v78" />
          </g>
          <path d="M296 116c16 0 22 38 10 44h-10z" fill={accent} />
        </g>
      );

    /* ------------------------------- PARK ------------------------------- */
    case 'park':
    case 'tabiat':
      return (
        <g>
          <circle cx="316" cy="52" r="30" fill={accent} className="art-float" />
          {category === 'tabiat' ? (
            <g>
              <path d="M-10 168l110-96 72 62 66-52 172 86v70H-10z" fill={main} opacity="0.7" />
              <path d="M100 72l32 28-64 0z" fill={accent} opacity="0.7" />
              <path d="M238 82l26 22-52 0z" fill={accent} opacity="0.55" />
            </g>
          ) : (
            <path d="M-10 176q110-48 210-12t210-22v86H-10z" fill={main} opacity="0.55" />
          )}
          <g className="art-drift" opacity="0.65">
            <path d="M40 58q10-10 20 0" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M66 50q10-10 20 0" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          <g>
            <rect x="112" y="166" width="15" height="50" rx="7" fill={deep} />
            <path
              className="art-sway"
              d="M120 178c-32 0-45-24-32-43-17-17 4-49 32-43 28-6 49 26 32 43 13 19 0 43-32 43z"
              fill={accent}
              opacity="0.92"
            />
          </g>
          <g>
            <rect x="266" y="180" width="12" height="40" rx="6" fill={deep} />
            <path
              className="art-sway"
              d="M272 190c-24 0-34-18-24-32-13-13 3-37 24-32 21-5 37 19 24 32 10 14 0 32-24 32z"
              fill={accent}
              opacity="0.75"
            />
          </g>
        </g>
      );

    /* ------------------------------- SAYR ------------------------------- */
    case 'sayr':
      return (
        <g>
          <circle cx="330" cy="48" r="22" fill={accent} opacity="0.9" />
          <g fill={main} opacity="0.85">
            <rect x="26" y="96" width="56" height="112" rx="8" />
            <rect x="94" y="62" width="66" height="146" rx="8" />
            <rect x="172" y="108" width="52" height="100" rx="8" />
            <rect x="236" y="76" width="74" height="132" rx="8" />
            <rect x="322" y="120" width="56" height="88" rx="8" />
          </g>
          <g fill={accent}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <rect
                key={i}
                className="art-blink"
                x={106 + (i % 5) * 16 + Math.floor(i / 5) * 148}
                y={80 + Math.floor(i / 5) * 24 + (i % 2) * 26}
                width="10"
                height="14"
                rx="3"
                opacity="0.9"
              />
            ))}
          </g>
          <rect x="-10" y="206" width="440" height="30" fill={deep} opacity="0.55" />
          <g className="art-wave">
            <path
              d="M-90 218h480"
              stroke={accent}
              strokeWidth="5"
              strokeDasharray="22 18"
              opacity="0.7"
            />
          </g>
        </g>
      );

    /* ------------------------------ GAMING ------------------------------ */
    case 'gaming':
      return (
        <g>
          <rect x="88" y="26" width="224" height="118" rx="12" fill={deep} />
          <rect x="98" y="36" width="204" height="98" rx="8" fill={main} opacity="0.55" />
          <g fill={accent}>
            <rect className="art-arc" x="118" y="98" width="22" height="22" rx="5" />
            <rect x="118" y="56" width="22" height="22" rx="5" opacity="0.45" className="art-float" />
            <rect x="256" y="76" width="22" height="22" rx="5" opacity="0.7" className="art-float" />
          </g>
          <rect x="186" y="144" width="28" height="18" fill={deep} />
          <rect x="150" y="160" width="100" height="10" rx="5" fill={deep} />
          <g>
            <rect x="106" y="178" width="188" height="44" rx="22" fill={main} />
            <g stroke={deep} strokeWidth="9" strokeLinecap="round">
              <path d="M142 192v16" />
              <path d="M134 200h16" />
            </g>
            <circle cx="248" cy="194" r="9" fill={accent} className="art-glow" />
            <circle cx="268" cy="210" r="9" fill={accent} opacity="0.6" />
          </g>
        </g>
      );

    /* ------------------------------- SPORT ------------------------------ */
    case 'sport':
      return (
        <g>
          <rect x="-10" y="120" width="420" height="115" fill={main} opacity="0.4" />
          <g stroke={accent} strokeWidth="4" fill="none" opacity="0.8">
            <path d="M-10 132h420" />
            <path d="M200 132v103" />
            <circle cx="200" cy="184" r="34" />
            <rect x="12" y="150" width="56" height="70" rx="4" />
            <rect x="332" y="150" width="56" height="70" rx="4" />
          </g>
          <g className="art-arc">
            <circle cx="120" cy="140" r="18" fill={accent} />
            <path d="M120 126l7 6-3 9h-8l-3-9z" fill={deep} />
          </g>
          <g stroke={accent} strokeWidth="6" fill="none" opacity="0.9">
            <path d="M46 54h56v44H46z" />
            <path d="M298 54h56v44h-56z" />
          </g>
        </g>
      );

    /* ------------------------------ SHOPPING ---------------------------- */
    case 'shopping':
      return (
        <g>
          <g className="art-float">
            <path d="M92 96h118l-12 118H104z" fill={main} />
            <path d="M124 96V76a28 28 0 0 1 56 0v20" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
            <circle cx="128" cy="140" r="8" fill={accent} />
            <circle cx="176" cy="140" r="8" fill={accent} />
            <path d="M126 164q26 20 52 0" stroke={accent} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
          <g className="art-float" style={{ animationDelay: '0.8s' }}>
            <path d="M226 118h92l-10 96h-72z" fill={accent} opacity="0.92" />
            <path d="M250 118V104a22 22 0 0 1 44 0v14" fill="none" stroke={main} strokeWidth="9" strokeLinecap="round" />
          </g>
          <g fill={accent}>
            <path className="art-blink" d="M330 66l5 13 13 5-13 5-5 13-5-13-13-5 13-5z" />
            <path className="art-blink" d="M66 56l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
          </g>
        </g>
      );

    /* ------------------------------- MUZEY ------------------------------ */
    case 'muzey':
      return (
        <g>
          <rect x="-10" y="40" width="420" height="152" fill={main} opacity="0.3" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <polygon
                className="art-glow"
                points={`${86 + i * 108},46 ${54 + i * 108},164 ${118 + i * 108},164`}
                fill={accent}
                opacity="0.14"
              />
              <rect x={52 + i * 108} y="66" width="66" height="76" rx="4" fill={accent} opacity="0.9" />
              <rect x={60 + i * 108} y="74" width="50" height="60" rx="2" fill={deep} opacity="0.75" />
              {i === 0 ? <circle cx="85" cy="96" r="12" fill={accent} opacity="0.8" /> : null}
              {i === 1 ? <path d="M176 128l18-26 16 22 10-12v22h-44z" fill={accent} opacity="0.8" /> : null}
              {i === 2 ? <rect x="282" y="90" width="30" height="30" rx="4" fill={accent} opacity="0.8" /> : null}
            </g>
          ))}
          <rect x="-10" y="188" width="420" height="10" fill={deep} opacity="0.5" />
          <rect x="140" y="198" width="120" height="14" rx="7" fill={deep} />
        </g>
      );

    /* -------------------------------- PHOTO ----------------------------- */
    case 'photo':
      return (
        <g>
          <rect x="74" y="66" width="252" height="138" rx="24" fill={main} />
          <rect x="160" y="44" width="80" height="28" rx="12" fill={main} />
          <circle cx="200" cy="136" r="54" fill={deep} />
          <g className="art-spin-slow">
            <circle cx="200" cy="136" r="44" fill="none" stroke={accent} strokeWidth="6" strokeDasharray="16 10" />
          </g>
          <circle cx="200" cy="136" r="30" fill={accent} opacity="0.92" />
          <circle cx="188" cy="124" r="10" fill="#fff" opacity="0.75" />
          <circle className="art-blink" cx="296" cy="96" r="11" fill={accent} />
          <rect x="96" y="90" width="34" height="12" rx="6" fill={deep} opacity="0.6" />
        </g>
      );

    /* ------------------------------ BOWLING ----------------------------- */
    case 'bowling':
      return (
        <g>
          <path d="M100 225l40-136h120l40 136z" fill={main} opacity="0.55" />
          <path d="M140 89h120" stroke={accent} strokeWidth="4" opacity="0.6" />
          <g fill={accent}>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                transform={`translate(${168 + (i % 3) * 32 + (i === 3 ? -32 : 0)} ${i === 3 ? 96 : 122})`}
                d="M0 44c-12 0-19-10-15-22 3-11 5-20 5-31 0-13 20-13 20 0 0 11 2 20 5 31 4 12-3 22-15 22z"
              />
            ))}
          </g>
          <g className="art-roll">
            <circle cx="200" cy="196" r="30" fill={deep} />
            <g fill={accent} opacity="0.85">
              <circle cx="190" cy="186" r="5" />
              <circle cx="208" cy="184" r="5" />
              <circle cx="199" cy="200" r="5" />
            </g>
          </g>
        </g>
      );

    /* ------------------------------ KARAOKE ----------------------------- */
    case 'karaoke':
      return (
        <g>
          <g fill={accent} opacity="0.9">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                className="art-bar"
                x={60 + i * 26}
                y="96"
                width="15"
                height="86"
                rx="7"
              />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={`r${i}`}
                className="art-bar"
                x={252 + i * 26}
                y="96"
                width="15"
                height="86"
                rx="7"
              />
            ))}
          </g>
          <g>
            <rect x="184" y="34" width="34" height="80" rx="17" fill={accent} />
            <g stroke={deep} strokeWidth="3" opacity="0.5">
              <path d="M186 52h30M186 64h30M186 76h30" />
            </g>
            <path d="M164 106a37 37 0 0 0 74 0" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" />
            <path d="M201 142v42" stroke={accent} strokeWidth="9" strokeLinecap="round" />
            <rect x="168" y="184" width="66" height="13" rx="6" fill={main} />
          </g>
        </g>
      );

    /* ----------------------------- SWIMMING ----------------------------- */
    case 'swimming':
      return (
        <g>
          <circle cx="322" cy="46" r="26" fill={accent} opacity="0.6" className="art-float" />
          <rect x="-10" y="104" width="420" height="130" fill={main} opacity="0.5" />
          <g stroke={accent} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85">
            <path className="art-wave" d="M-90 130q20-16 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" />
            <path className="art-wave" style={{ animationDuration: '8s' }} d="M-90 166q20-16 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" />
            <path className="art-wave" style={{ animationDuration: '5s' }} d="M-90 202q20-16 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" />
          </g>
          <g className="art-float">
            <circle cx="132" cy="112" r="26" fill="none" stroke={accent} strokeWidth="12" />
          </g>
        </g>
      );

    /* --------------------------- ENTERTAINMENT -------------------------- */
    case 'entertainment':
      return (
        <g>
          <path d="M200 132L128 225h144z" fill={main} opacity="0.6" />
          <g className="art-spin" style={{ transformOrigin: '200px 120px' }}>
            <circle cx="200" cy="120" r="78" fill="none" stroke={accent} strokeWidth="6" />
            <g stroke={main} strokeWidth="6" strokeLinecap="round">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <path
                  key={deg}
                  d={`M200 120L${(200 + 78 * Math.cos((deg * Math.PI) / 180)).toFixed(1)} ${(
                    120 +
                    78 * Math.sin((deg * Math.PI) / 180)
                  ).toFixed(1)}`}
                />
              ))}
            </g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <circle
                key={`c${deg}`}
                cx={(200 + 78 * Math.cos((deg * Math.PI) / 180)).toFixed(1)}
                cy={(120 + 78 * Math.sin((deg * Math.PI) / 180)).toFixed(1)}
                r="11"
                fill={accent}
              />
            ))}
          </g>
          <circle cx="200" cy="120" r="14" fill={accent} />
        </g>
      );

    default:
      return (
        <g>
          <circle cx="200" cy="112" r="56" fill={accent} opacity="0.9" className="art-float" />
          <path d="M-10 180q110-42 210 0t210 0v56H-10z" fill={main} opacity="0.55" />
        </g>
      );
  }
}

/**
 * @param {string} category joy kategoriyasi
 * @param {string} seed     bir xil kategoriyadagi joylar biroz farq qilsin
 */
export function PlaceArt({ category = 'default', seed = '', className = '' }) {
  const key = String(seed).startsWith('breakfast') ? 'breakfast' : category;
  const colors = palette(key);
  const id = `art-${key}-${String(seed).replace(/[^a-z0-9]/gi, '') || 'x'}`;
  const tilt = (String(seed).length % 5) - 2;

  return (
    <svg
      className={`art ${className}`}
      viewBox="0 0 400 225"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor={colors[0]} stopOpacity="0" />
          <stop offset="1" stopColor={colors[0]} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <rect width="400" height="225" fill={`url(#${id})`} />
      <Backdrop c={colors} />
      <g transform={`rotate(${tilt} 200 112)`}>
        <Scene category={key} c={colors} />
      </g>
      <rect width="400" height="225" fill={`url(#${id}-shade)`} />
    </svg>
  );
}
