// scenes.jsx — Proximity Reel 3: Campus proximity (LIGHT theme)

const PROX = {
  red:    '#E5322B',
  redDk:  '#B81F19',
  redLight: 'rgba(229,50,43,0.08)',
  black:  '#0B0B0C',
  ink:    '#16161A',
  paper:  '#F7F3EE',
  cream:  '#EFE9E0',
  mute:   '#7A7570',
  white:  '#FFFFFF',
  bg:     '#FAFAF8',
};

const FONT_DISPLAY = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace';

// ── Logo ──────────────────────────────────────────────────────────────────
function ProxLogoForBg({ size = 120, color = PROX.red, bg = PROX.white }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: 'block' }}>
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="5"/>
      <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="4"/>
      <rect x="48" y="0" width="4" height="10" fill={color}/>
      <rect x="48" y="90" width="4" height="10" fill={color}/>
      <rect x="0" y="48" width="10" height="4" fill={color}/>
      <rect x="90" y="48" width="10" height="4" fill={color}/>
      <path d="M50 28 L68 44 L68 66 L32 66 L32 44 Z" fill={color}/>
      <rect x="46" y="54" width="8" height="12" fill={bg}/>
    </svg>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────
function IconPin({ size = 24, color = PROX.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color}/>
      <circle cx="12" cy="9" r="2.5" fill={PROX.white}/>
    </svg>
  );
}
function IconStar({ size = 24, color = PROX.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" fill={color}/>
    </svg>
  );
}
function IconHouse({ size = 24, color = PROX.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12l9-9 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="9" y="14" width="6" height="6" rx="0.5" fill={color}/>
    </svg>
  );
}
function IconPeople({ size = 24, color = PROX.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" fill={color}/>
      <circle cx="17" cy="7" r="2.5" fill={color} opacity="0.6"/>
      <path d="M2 21v-2a5 5 0 0110 0v2" fill={color}/>
      <path d="M14 21v-1.5a4.5 4.5 0 016 0V21" fill={color} opacity="0.6"/>
    </svg>
  );
}
function IconTransit({ size = 24, color = PROX.red }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="14" rx="3" fill={color}/>
      <rect x="7" y="6" width="10" height="5" rx="1" fill={PROX.white}/>
      <circle cx="8" cy="14" r="1.5" fill={PROX.white}/>
      <circle cx="16" cy="14" r="1.5" fill={PROX.white}/>
      <path d="M7 20l-1 2M17 20l1 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Walk-time badge (light theme) ─────────────────────────────────────────
function WalkBadge({ minutes, label, delay, localTime, filled = false }) {
  const t = clamp((localTime - delay) / 0.4, 0, 1);
  const eased = Easing.easeOutBack(t);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 28px',
      borderRadius: 18,
      background: filled ? PROX.red : PROX.white,
      border: `2px solid ${filled ? PROX.red : PROX.cream}`,
      boxShadow: filled ? '0 4px 16px rgba(229,50,43,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
      opacity: t,
      transform: `translateY(${(1 - eased) * 20}px) scale(${0.92 + eased * 0.08})`,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontWeight: 700, fontSize: 32,
        color: filled ? PROX.white : PROX.red,
        lineHeight: 1,
      }}>{minutes}<span style={{ fontSize: 18 }}>min</span></div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 24,
        color: filled ? PROX.white : PROX.ink,
        letterSpacing: '-0.01em',
      }}>{label}</div>
    </div>
  );
}

// ── Bad listing (text only, no image block, bigger) ───────────────────────
function BadListing({ delay, localTime, price, distance, issue }) {
  const t = clamp((localTime - delay) / 0.35, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      padding: '22px 28px',
      borderRadius: 18,
      background: PROX.white,
      border: '1.5px solid rgba(229,50,43,0.15)',
      opacity: t,
      transform: `translateX(${(1 - eased) * 40}px)`,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 18, fontWeight: 700, color: PROX.red,
          padding: '5px 12px', background: 'rgba(229,50,43,0.1)', borderRadius: 8,
        }}>{price}</div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 16, fontWeight: 600, color: PROX.redDk,
          padding: '5px 12px', background: 'rgba(229,50,43,0.06)', borderRadius: 8,
        }}>{distance}</div>
      </div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 500,
        color: PROX.mute, letterSpacing: '0.01em',
      }}>{issue}</div>
    </div>
  );
}

// ── Pill (light theme) ───────────────────────────────────────────────────
function Pill({ children, filled = false }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '12px 20px',
      borderRadius: 999,
      background: filled ? PROX.red : PROX.white,
      border: `1.5px solid ${filled ? PROX.red : PROX.cream}`,
      color: filled ? PROX.white : PROX.ink,
      fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 22,
      letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    }}>{children}</div>
  );
}

// ── Background (light) ───────────────────────────────────────────────────
function BackgroundLayer() {
  const t = useTime();
  const drift = (t * 3) % 100;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: PROX.bg }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(60% 50% at 50% 20%, rgba(229,50,43,0.06), transparent 70%)`,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(40% 35% at 80% 90%, rgba(229,50,43,0.04), transparent 70%)`,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0 1px, transparent 1px 80px)`,
        transform: `translateY(${drift}px)`, opacity: 0.5,
      }}/>
    </>
  );
}

// ── Scene 1: Campus hero ──────────────────────────────────────────────────
function Scene1CampusHero() {
  const { localTime, duration } = useSprite();

  const imgT = clamp(localTime / 0.8, 0, 1);
  const imgEased = Easing.easeOutCubic(imgT);
  const kenBurns = 1 + localTime * 0.012;
  const textT = clamp((localTime - 0.3) / 0.6, 0, 1);
  const textEased = Easing.easeOutCubic(textT);
  const subT = clamp((localTime - 0.7) / 0.5, 0, 1);
  const subEased = Easing.easeOutCubic(subT);
  const exitFade = localTime > duration - 0.45 ? clamp((localTime - (duration - 0.45)) / 0.45, 0, 1) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exitFade }}>
      <div style={{
        position: 'absolute', inset: -40,
        opacity: imgEased * 0.9,
        transform: `scale(${kenBurns})`, transformOrigin: '50% 30%',
      }}>
        <img src="washington-university-in-st-louis-campus-ez3w25zm46fsgn74.jpg"
          alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(250,250,248,0.05) 0%, rgba(250,250,248,0.25) 35%, rgba(250,250,248,0.85) 70%, rgba(250,250,248,1) 100%)`,
      }}/>
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 620,
        opacity: textT, transform: `translateY(${(1 - textEased) * 40}px)`,
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 800,
          fontSize: 148, lineHeight: 0.9, letterSpacing: '-0.045em', color: PROX.ink,
        }}>
          This is<br/><span style={{ color: PROX.red }}>home</span>.
        </div>
      </div>
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 1050,
        opacity: subT, transform: `translateY(${(1 - subEased) * 20}px)`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 24, fontWeight: 600,
          letterSpacing: '0.25em', textTransform: 'uppercase', color: PROX.red,
        }}>Washington University in St. Louis</div>
      </div>
    </div>
  );
}

// ── Scene 2: On-campus vs off-campus ──────────────────────────────────────
function Scene2CommuteProblem() {
  const { localTime, duration } = useSprite();

  const headT = clamp(localTime / 0.5, 0, 1);
  const headEased = Easing.easeOutCubic(headT);
  const imgT = clamp((localTime - 0.15) / 0.6, 0, 1);
  const imgEased = Easing.easeOutCubic(imgT);
  const kenBurns = 1 + (localTime - 0.15) * 0.006;
  const labelT = clamp((localTime - 0.5) / 0.4, 0, 1);
  const labelEased = Easing.easeOutBack(labelT);
  const exitFade = localTime > duration - 0.4 ? clamp((localTime - (duration - 0.4)) / 0.4, 0, 1) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exitFade }}>
      {/* Header */}
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 180,
        opacity: headT, transform: `translateY(${(1 - headEased) * 30}px)`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 24,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: PROX.red, marginBottom: 24,
        }}>on campus —</div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 88, fontWeight: 800,
          lineHeight: 0.92, letterSpacing: '-0.04em', color: PROX.ink,
        }}>
          This is what<br/>you're <span style={{ color: PROX.red }}>close to</span>.
        </div>
      </div>

      {/* Campus image — Umrath House */}
      <div style={{
        position: 'absolute', left: 48, right: 48, top: 640,
        height: 480, borderRadius: 28, overflow: 'hidden',
        opacity: imgT, transform: `scale(${0.95 + imgEased * 0.05})`,
        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
      }}>
        <img src="Washington-University-Umrath-House-new-3--2000.jpg" alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: `scale(${kenBurns})`, transformOrigin: '40% 50%',
          }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}/>
        <div style={{
          position: 'absolute', bottom: 24, left: 24,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 20px', background: PROX.red, borderRadius: 12,
          opacity: labelT,
          transform: `translateY(${(1 - labelEased) * 16}px) scale(${0.9 + labelEased * 0.1})`,
        }}>
          <IconPin size={18} color={PROX.white}/>
          <div style={{
            fontFamily: FONT_MONO, fontWeight: 700, fontSize: 16,
            letterSpacing: '0.15em', textTransform: 'uppercase', color: PROX.white,
          }}>On-Campus Housing</div>
        </div>
        <div style={{
          position: 'absolute', bottom: 24, right: 24,
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22,
          color: PROX.white, opacity: labelT,
        }}>South 40 · Umrath House</div>
      </div>

      {/* Commute stats row */}
      <div style={{
        position: 'absolute', left: 48, right: 48, top: 1180,
        display: 'flex', gap: 16,
      }}>
        {[
          { value: '34', unit: 'min', label: 'avg. commute\noff-campus', delay: 0.9 },
          { value: '67', unit: '%', label: 'of listings\n30+ min away', delay: 1.05 },
          { value: '3x', unit: '', label: 'more time\nvs on-campus', delay: 1.2 },
        ].map((stat, i) => {
          const st = clamp((localTime - stat.delay) / 0.45, 0, 1);
          const se = Easing.easeOutBack(st);
          const displayVal = stat.unit === '' ? stat.value : Math.round(Easing.easeOutCubic(st) * parseInt(stat.value));
          return (
            <div key={i} style={{
              flex: 1, padding: '24px 16px', borderRadius: 20,
              background: PROX.white,
              border: '1.5px solid rgba(229,50,43,0.15)',
              boxShadow: '0 4px 16px rgba(229,50,43,0.06)',
              textAlign: 'center',
              opacity: st,
              transform: `translateY(${(1 - se) * 24}px)`,
            }}>
              <div style={{
                fontFamily: FONT_MONO, fontWeight: 800, fontSize: 52,
                color: PROX.red, lineHeight: 1,
              }}>{stat.unit === '' ? stat.value : displayVal}<span style={{ fontSize: 28 }}>{stat.unit}</span></div>
              <div style={{
                fontFamily: FONT_MONO, fontWeight: 500, fontSize: 15,
                color: PROX.mute, lineHeight: 1.3, marginTop: 8, whiteSpace: 'pre-line',
              }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Bad off-campus listings — text only, bigger */}
      <div style={{
        position: 'absolute', left: 48, right: 48, top: 1440,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <BadListing delay={1.35} localTime={localTime} price="$1,850/mo" distance="35 min drive" issue="No reviews · No photos · Unverified landlord"/>
        <BadListing delay={1.5} localTime={localTime} price="$2,200/mo" distance="28 min bus" issue="No lease details · Last updated 4 months ago"/>
        <BadListing delay={1.65} localTime={localTime} price="$1,600/mo" distance="42 min transit" issue="No student reviews · No floor plan"/>
      </div>
    </div>
  );
}

// ── Scene 3: Walk times ───────────────────────────────────────────────────
function Scene3WalkTimes() {
  const { localTime, duration } = useSprite();

  const headT = clamp(localTime / 0.5, 0, 1);
  const headEased = Easing.easeOutCubic(headT);
  const exitFade = localTime > duration - 0.4 ? clamp((localTime - (duration - 0.4)) / 0.4, 0, 1) : 0;

  const img1T = clamp((localTime - 0.15) / 0.5, 0, 1);
  const img2T = clamp((localTime - 0.3) / 0.5, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exitFade }}>
      {/* Heading */}
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 180,
        opacity: headT, transform: `translateY(${(1 - headEased) * 30}px)`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 24,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: PROX.red, marginBottom: 24,
        }}>with proximity —</div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 84, fontWeight: 800,
          lineHeight: 0.95, letterSpacing: '-0.035em', color: PROX.ink,
        }}>
          Know <span style={{ color: PROX.red }}>exactly</span><br/>
          how close<br/>you'll be.
        </div>
      </div>

      {/* Two campus images */}
      <div style={{
        position: 'absolute', left: 48, right: 48, top: 720,
        display: 'flex', gap: 16, height: 380,
      }}>
        <div style={{
          flex: 1, borderRadius: 22, overflow: 'hidden', position: 'relative',
          opacity: Easing.easeOutCubic(img1T),
          transform: `translateY(${(1 - img1T) * 30}px)`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        }}>
          <img src="u5ZrCh.webp" alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: `scale(${1 + localTime * 0.005})`, transformOrigin: '50% 60%',
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)',
          }}/>
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600,
            color: PROX.white, letterSpacing: '0.08em',
          }}>Brookings Hall</div>
        </div>
        <div style={{
          flex: 1, borderRadius: 22, overflow: 'hidden', position: 'relative',
          opacity: Easing.easeOutCubic(img2T),
          transform: `translateY(${(1 - img2T) * 30}px)`,
          boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
        }}>
          <img src="OIP.webp" alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: `scale(${1 + localTime * 0.005})`, transformOrigin: '50% 40%',
          }}/>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)',
          }}/>
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            fontFamily: FONT_MONO, fontSize: 13, fontWeight: 600,
            color: PROX.white, letterSpacing: '0.08em',
          }}>Danforth Campus</div>
        </div>
      </div>

      {/* Walk-time badges */}
      <div style={{
        position: 'absolute', left: 48, right: 48, top: 1150,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <WalkBadge minutes={5} label="to Brookings Hall" delay={0.5} localTime={localTime} filled={true}/>
        <WalkBadge minutes={3} label="to the Delmar Loop" delay={0.65} localTime={localTime}/>
        <WalkBadge minutes={2} label="to South 40" delay={0.8} localTime={localTime} filled={true}/>
        <WalkBadge minutes={8} label="to MetroLink" delay={0.95} localTime={localTime}/>
        <WalkBadge minutes={6} label="to Olin Library" delay={1.1} localTime={localTime}/>
      </div>
    </div>
  );
}

// ── Scene 4: Features ─────────────────────────────────────────────────────
function FeatureRow({ icon, text, delay, localTime }) {
  const t = clamp((localTime - delay) / 0.4, 0, 1);
  const eased = Easing.easeOutCubic(t);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 20,
      padding: '22px 0',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      opacity: t, transform: `translateX(${(1 - eased) * 30}px)`,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'rgba(229,50,43,0.08)',
        border: '1.5px solid rgba(229,50,43,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 600,
        color: PROX.ink, letterSpacing: '-0.01em', lineHeight: 1.3,
      }}>{text}</div>
    </div>
  );
}

function Scene4Features() {
  const { localTime, duration } = useSprite();

  const headT = clamp(localTime / 0.5, 0, 1);
  const headEased = Easing.easeOutCubic(headT);
  const exitFade = localTime > duration - 0.4 ? clamp((localTime - (duration - 0.4)) / 0.4, 0, 1) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exitFade }}>
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 260,
        opacity: headT, transform: `translateY(${(1 - headEased) * 30}px)`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 24,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: PROX.red, marginBottom: 24,
        }}>built different —</div>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 88, fontWeight: 800,
          lineHeight: 0.95, letterSpacing: '-0.035em', color: PROX.ink,
        }}>
          Housing<br/>built for<br/><span style={{ color: PROX.red }}>WashU</span>.
        </div>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, top: 880 }}>
        <FeatureRow icon={<IconPin size={28} color={PROX.red}/>} text="Walk times to every building on campus" delay={0.3} localTime={localTime}/>
        <FeatureRow icon={<IconStar size={28} color={PROX.red}/>} text="Reviews from real WashU students" delay={0.5} localTime={localTime}/>
        <FeatureRow icon={<IconHouse size={28} color={PROX.red}/>} text="Verified landlords & lease details" delay={0.7} localTime={localTime}/>
        <FeatureRow icon={<IconPeople size={28} color={PROX.red}/>} text="Roommate matching by school & year" delay={0.9} localTime={localTime}/>
        <FeatureRow icon={<IconTransit size={28} color={PROX.red}/>} text="Loop shuttle & transit proximity" delay={1.1} localTime={localTime}/>
      </div>

      {/* Bottom pills */}
      <div style={{
        position: 'absolute', left: 72, right: 72, top: 1480,
        display: 'flex', flexWrap: 'wrap', gap: 12,
      }}>
        {[
          { label: 'Sublet-friendly', filled: false, delay: 1.2 },
          { label: 'Utilities included', filled: true, delay: 1.3 },
          { label: 'Furnished', filled: false, delay: 1.4 },
          { label: 'Pet-friendly', filled: false, delay: 1.5 },
          { label: 'No co-signer', filled: true, delay: 1.6 },
        ].map((p, i) => {
          const pt = clamp((localTime - p.delay) / 0.3, 0, 1);
          const pe = Easing.easeOutBack(pt);
          return (
            <div key={i} style={{
              opacity: pt,
              transform: `translateY(${(1 - pe) * 18}px) scale(${0.92 + pe * 0.08})`,
            }}>
              <Pill filled={p.filled}>{p.label}</Pill>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Scene 5: CTA ──────────────────────────────────────────────────────────
function Scene5CTA() {
  const { localTime } = useSprite();

  const logoT = clamp(localTime / 0.5, 0, 1);
  const logoEased = Easing.easeOutCubic(logoT);
  const tagT = clamp((localTime - 0.35) / 0.5, 0, 1);
  const tagEased = Easing.easeOutCubic(tagT);
  const ctaT = clamp((localTime - 0.7) / 0.5, 0, 1);
  const ctaEased = Easing.easeOutBack(ctaT);
  const urlT = clamp((localTime - 1.1) / 0.4, 0, 1);
  const pulse = 1 + Math.sin(localTime * 4) * 0.015 * clamp((localTime - 1.2) * 2, 0, 1);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', top: 260, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        opacity: logoT, transform: `translateY(${(1 - logoEased) * 30}px)`,
      }}>
        <ProxLogoForBg size={180} bg={PROX.bg}/>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 88,
          letterSpacing: '-0.035em', color: PROX.ink, lineHeight: 1,
        }}>Proximity</div>
      </div>

      <div style={{
        position: 'absolute', top: 640, left: 72, right: 72, textAlign: 'center',
        opacity: tagT, transform: `translateY(${(1 - tagEased) * 24}px)`,
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 80, fontWeight: 800,
          lineHeight: 0.95, letterSpacing: '-0.04em', color: PROX.ink,
        }}>
          Minutes from<br/>campus.<br/>
          <span style={{ color: PROX.red }}>Miles from<br/>stress.</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 1200, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: ctaT, transform: `scale(${0.85 + ctaEased * 0.15 * pulse})`,
      }}>
        <div style={{
          padding: '36px 72px', background: PROX.red, color: PROX.white,
          fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52,
          letterSpacing: '-0.02em', borderRadius: 999,
          boxShadow: '0 20px 60px rgba(229,50,43,0.35), 0 0 0 6px rgba(229,50,43,0.1)',
          display: 'inline-flex', alignItems: 'center', gap: 22,
        }}>
          Find Your Place
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: PROX.white, color: PROX.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 900,
          }}>→</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 200, left: 0, right: 0, textAlign: 'center',
        opacity: urlT, transform: `translateY(${(1 - Easing.easeOutCubic(urlT)) * 18}px)`,
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 34, letterSpacing: '0.04em', color: PROX.ink,
        }}>useproximity.org</div>
        <div style={{
          marginTop: 14, fontFamily: FONT_MONO, fontSize: 18,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: PROX.mute,
        }}>swipe up · tap link</div>
      </div>
    </div>
  );
}

// ── Main composition ──────────────────────────────────────────────────────
function CampusReel() {
  return (
    <>
      <BackgroundLayer/>
      <Sprite start={0}    end={3.2}>  <Scene1CampusHero/>    </Sprite>
      <Sprite start={3.2}  end={6.4}>  <Scene2CommuteProblem/></Sprite>
      <Sprite start={6.4}  end={10.0}> <Scene3WalkTimes/>     </Sprite>
      <Sprite start={10.0} end={12.8}> <Scene4Features/>      </Sprite>
      <Sprite start={12.8} end={15.5}> <Scene5CTA/>           </Sprite>
    </>
  );
}

Object.assign(window, { CampusReel, PROX });
