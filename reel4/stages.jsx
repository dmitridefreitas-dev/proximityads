/* ─────────────────────────────────────────────────────────────
   Proximity ad — stages.jsx
   Brand-locked: Inter, #E23A2F red, persistent chrome.
   Coordinate space: container query units (cqw/cqh) on .stage.
   ───────────────────────────────────────────────────────────── */

const { useEffect, useState, useRef, useMemo } = React;

/* ── Brand mark (inline SVG so we can recolor) ─────────── */
function BrandMark({ color = 'currentColor', style }) {
  return (
    <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={style} aria-hidden>
      <g fill={color}>
        <path d="M493.79,197.29c269-14.78,435.48,278.96,281.02,501.02-124.36,178.79-385.55,182.34-516.21,8.58-153.66-204.35-19.87-495.59,235.19-509.6ZM294,493c7.72-101.79,94.97-187.62,196.35-196.15l1.65-1.35v-55c-.75-1.02-.87-1.09-2.04-1.09-12.34-.02-28.8,3.34-40.97,6.07-117.3,26.35-204.7,127.56-213.99,247.51h59ZM534,239v58c102.23,6.2,192.16,93.31,199,196h59c-8.97-99.59-71.09-189.28-162.32-230.18-30.53-13.68-62.3-21.02-95.68-23.82ZM643.65,392.35c-108.21-112.35-302.62-42.24-309.69,115.11-5.96,132.6,131.1,225.7,252.72,171.72,111.54-49.51,142.58-197.93,56.97-286.83ZM293,534h-58c8.95,135.6,120.94,249.96,257,259v-58c-104.94-7.21-190.33-97.44-199-201ZM792,534h-59c-7.05,103.61-94.74,193.93-199,201v58c135.99-8.8,249.07-123.29,258-259Z" />
        <path d="M588,646h-58v-28.5c0-.56-2.27-3.45-3.02-3.98-2.84-1.99-20.61-2.23-24.46-1.5-1.45.28-5.52,3.91-5.52,4.48v29.5h-58v-142l74.42-36.99c25.04,12.37,50.84,24,74.58,38.49v140.5ZM473.74,530.17c-2.98.61-6.27,4.32-6.68,7.39,1.26,15.77-1.88,34.59-.08,49.96,1.19,10.15,16.4,10.82,17.93-.11,1.33-9.54,1.25-39.2.11-48.93-.63-5.36-6.01-9.39-11.29-8.31ZM512.77,530.18c-3.27.35-7.55,2.67-7.71,6.38,1.01,16.08-1.56,34.15-.11,49.98,1.08,11.88,15.6,10.73,16.99,1.89,1.31-8.33,1.25-42.43.11-50.99-.55-4.15-5.08-7.72-9.28-7.27ZM548.73,530.17c-2.98.62-6.26,4.32-6.68,7.38,1.08,15.64-1.66,33.6-.05,48.94,1.19,11.34,15.43,11.48,16.94,1.95,1.38-8.68,1.16-40.86.08-49.97-.6-5.07-4.96-9.4-10.29-8.3Z" />
        <path d="M405,488v44.5c0,3.26,7.48,14.82,7.93,21.14.43,5.95-3.86,9.72-3.86,12.86,0,1.93,5.55,13.08,6.48,17.45,1.13,5.31,2.96,16.6-1.58,20.52-2.84,2.45-23.83,2.18-27.34.39-6.09-3.1-3.5-15.25-2.34-21.07.93-4.67,6.22-15.23,6.3-17.29.09-2.31-2.89-6.38-3.36-9.25-1.76-10.74,5.72-16,6.79-24.74,1.87-15.28-1.48-34.17.01-49.86-6.47-3.76-13.5-6.59-20.07-10.19-1.13-.62-2.44.07-1.97-1.97l139.57-76.52,4.15.79,138.26,73.72-56.32,25.21-86.05-38.67-86.35,40.8c-5.74,1-14.43-6.85-20.25-7.83Z" />
      </g>
    </svg>
  );
}

/* ── tiny math/anim helpers ─────────────────────────────── */
const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
const p = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = {
  outCubic: (x) => 1 - Math.pow(1 - x, 3),
  inCubic:  (x) => x * x * x,
  outQuint: (x) => 1 - Math.pow(1 - x, 5),
  outBack:  (x) => { const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(x-1,3) + c1*Math.pow(x-1,2); },
  outElastic: (x) => {
    if (x === 0 || x === 1) return x;
    const c4 = (2*Math.PI)/3;
    return Math.pow(2, -10*x) * Math.sin((x*10 - 0.75) * c4) + 1;
  }
};
const typed = (str, prog) => str.slice(0, Math.round(str.length * clamp(prog)));

/* ── Common helpers: which "scene mode" are we in at t? ── */
// "video" → bright video; chrome should be white
// "red"   → red wash (badge stamp); chrome should be white
// "light" → paper bg; chrome should be dark
// "dark"  → dark logo stage; chrome should be white
function sceneAt(t, T) {
  if (t < T.fade.start + 0.35) return 'video';
  if (t >= T.badge.start - 0.05 && t < T.chat.start - 0.1) return 'red';
  if (t >= T.logo.start - 0.1) return 'darkClosing';
  return 'light';
}

/* ────────────────────────────────────────────────────────
   STAGE 1 — Cinematic video hook (capped to 5s by app.jsx)
   ──────────────────────────────────────────────────────── */
function VideoStage({ t, T, videoRef }) {
  // soft fade-out over fade window
  const fadeOut = ease.outCubic(p(t, T.fade.start, T.fade.start + 0.6));
  const visible = t < T.fade.start + 0.7;
  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 1,
      opacity: visible ? 1 - fadeOut : 0,
      pointerEvents:'none',
    }}>
      <video
        ref={videoRef}
        src="assets/hook.mp4"
        playsInline
        preload="auto"
        style={{
          position:'absolute', inset:0,
          width:'100%', height:'100%',
          objectFit:'cover',
          background:'#000',
        }}
      />
      {/* warm vignette */}
      <div style={{
        position:'absolute', inset:0,
        background:
          'radial-gradient(120% 80% at 50% 60%, transparent 40%, rgba(0,0,0,.55) 100%),'+
          'linear-gradient(180deg, rgba(255,170,90,.05), transparent 40%, rgba(0,0,0,.18))',
        mixBlendMode:'multiply',
      }} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 2 — Fade transition (soft, no white flash)
   Cross-fades from the video to the paper bg of the next scene.
   ──────────────────────────────────────────────────────── */
function FadeStage({ t, T }) {
  const inP = ease.outCubic(p(t, T.fade.start + 0.05, T.fade.start + 0.7));
  const outP = p(t, T.headline.end - 0.4, T.headline.end);
  // bg sticks until headline ends
  if (inP <= 0 || outP >= 1) return null;
  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 3,
      background:'var(--paper)',
      opacity: inP * (1 - outP),
      pointerEvents:'none',
    }} />
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 3 — Headline "There's a faster way."
   Inter Black. Paper bg. "faster" in brand red.
   ──────────────────────────────────────────────────────── */
function HeadlineStage({ t, T }) {
  if (t < T.headline.start - 0.05 || t > T.headline.end + 0.05) return null;

  const words = ["There's", "a", "faster", "way."];
  const baseIn = T.headline.start;
  const out = p(t, T.headline.end - 0.35, T.headline.end);
  const subP = clamp(p(t, baseIn + 0.55, baseIn + 1.1)) * (1 - out);

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 6,
      display:'flex', flexDirection:'column', justifyContent:'center',
      padding:'0 7cqw',
      pointerEvents:'none',
      opacity: 1 - out,
      color:'var(--text)',
    }}>
      <div style={{
        fontFamily:'"Inter", sans-serif',
        fontWeight: 900,
        fontSize:'17cqw',
        lineHeight: .92,
        letterSpacing:'-0.035em',
        textAlign:'left',
        width:'100%',
        textWrap:'balance',
      }}>
        {words.map((w, i) => {
          const start = baseIn + i * 0.12;
          const pr = ease.outBack(p(t, start, start + 0.45));
          const isFaster = w === "faster";
          return (
            <span key={i} style={{
              display:'inline-block',
              marginRight: '0.22em',
              transform: `translateY(${(1 - pr) * 28}%)`,
              opacity: clamp(pr * 1.4),
              color: isFaster ? 'var(--red)' : 'var(--text)',
              willChange:'transform',
            }}>{w}</span>
          );
        })}
      </div>
      <div style={{
        marginTop:'3.5cqh',
        fontFamily:'"Inter", sans-serif',
        fontWeight: 500,
        fontSize:'3.2cqw',
        letterSpacing:'.24em',
        textTransform:'uppercase',
        opacity: subP,
        transform:`translateY(${(1 - subP) * 8}px)`,
        color:'var(--text-2)',
      }}>
        off-campus housing, matched in seconds
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 4 — App opens / form auto-fills
   ──────────────────────────────────────────────────────── */
function FormStage({ t, T }) {
  if (t < T.form.start - 0.1 || t > T.cards.start + 0.4) return null;

  const mount = ease.outQuint(p(t, T.form.start, T.form.start + 0.6));
  const f1 = p(t, T.form.start + 0.4,  T.form.start + 1.05);
  const f2 = p(t, T.form.start + 1.05, T.form.start + 1.7);
  const f3 = p(t, T.form.start + 1.7,  T.form.start + 2.3);
  const btnP = p(t, T.form.start + 2.45, T.form.start + 2.65);
  const btnPulse = Math.sin(btnP * Math.PI);
  const exit = ease.inCubic(p(t, T.cards.start - 0.25, T.cards.start + 0.15));

  const fields = [
    { label:'where',    value:'WashU · Skinker',  icon:'◎', prog:f1, active: f1 > 0 && f1 < 1 },
    { label:'budget',   value:'$1,400 / mo',      icon:'$', prog:f2, active: f2 > 0 && f2 < 1 },
    { label:'move-in',  value:'Aug 15 → 12 mo',   icon:'◷', prog:f3, active: f3 > 0 && f3 < 1 },
  ];

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 7,
      background:'var(--paper)',
      color:'var(--text)',
      opacity: 1 - exit,
      transform: `translateY(${exit * -6}%)`,
      willChange:'transform, opacity',
    }}>
      {/* heading — top padding gives chrome room */}
      <div style={{
        position:'relative',
        padding:'15cqh 6cqw 0',
        opacity: mount,
        transform:`translateY(${(1-mount)*10}px)`,
      }}>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 900,
          fontSize:'13cqw',
          lineHeight:.95,
          letterSpacing:'-.035em',
        }}>
          Find your<br/>place.
        </div>
        <div style={{
          marginTop:'1.6cqh',
          fontSize:'3.2cqw',
          color:'var(--text-2)',
          maxWidth:'70%',
        }}>
          Tell us where & when. We'll handle the rest.
        </div>
      </div>

      {/* fields */}
      <div style={{
        position:'relative',
        marginTop:'5cqh',
        padding:'0 6cqw',
        display:'flex', flexDirection:'column',
        gap:'2.2cqh',
      }}>
        {fields.map((f, i) => {
          const fieldMount = ease.outBack(p(t, T.form.start + 0.2 + i*0.1, T.form.start + 0.6 + i*0.1));
          return (
            <div key={i} style={{
              opacity: fieldMount,
              transform: `translateY(${(1-fieldMount)*16}px)`,
              willChange:'transform, opacity',
            }}>
              <Field {...f} />
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{
        position:'absolute', left:'6cqw', right:'6cqw',
        bottom:'7cqh',
      }}>
        <button style={{
          width:'100%',
          padding:'2.6cqh 4cqw',
          background:'var(--red)',
          color:'#fff',
          border:'none',
          borderRadius:'999px',
          fontFamily:'"Inter", sans-serif',
          fontSize:'4.2cqw',
          fontWeight: 700,
          letterSpacing:'-.01em',
          transform: `scale(${1 - btnPulse*0.06})`,
          boxShadow: btnPulse > 0
            ? `0 0 0 ${btnPulse*8}px rgba(226,58,47,.15)`
            : 'none',
          transition:'box-shadow 80ms linear',
        }}>
          Match me with places
          <span style={{
            display:'inline-block',
            marginLeft:'0.5em',
            transform:`translateX(${btnPulse * 8}px)`,
          }}>→</span>
        </button>
        <div style={{
          marginTop:'1.4cqh',
          textAlign:'center',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 500,
          fontSize:'2.2cqw',
          color:'var(--text-2)',
          letterSpacing:'.18em',
          textTransform:'uppercase',
        }}>
          avg. match · 3.8 seconds
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, icon, prog, active }) {
  const text = typed(value, prog);
  return (
    <div style={{
      background:'#fff',
      border: `1.5px solid ${active ? 'var(--red)' : 'var(--line)'}`,
      borderRadius:'2.5cqw',
      padding:'2cqh 3.5cqw',
      transition:'border-color 180ms ease',
      boxShadow: active ? '0 0 0 4px rgba(226,58,47,.10)' : 'none',
    }}>
      <div style={{
        fontFamily:'"Inter", sans-serif',
        fontWeight: 700,
        fontSize:'2.1cqw',
        textTransform:'uppercase',
        letterSpacing:'.18em',
        color: 'var(--text-2)',
      }}>{label}</div>
      <div style={{
        marginTop:'.6cqh',
        display:'flex', alignItems:'center', gap:'2cqw',
        fontFamily:'"Inter", sans-serif',
        fontSize:'4.6cqw',
        fontWeight:600,
      }}>
        <span style={{
          width:'7cqw', height:'7cqw',
          borderRadius:'50%',
          background:'var(--red-tint)',
          color:'var(--red)',
          display:'grid', placeItems:'center',
          fontSize:'3.4cqw',
          fontWeight: 700,
        }}>{icon}</span>
        <span>
          {text}
          {prog > 0 && prog < 1 && (
            <span style={{
              display:'inline-block',
              width:'2px', height:'1em',
              background:'var(--red)',
              verticalAlign:'-0.15em',
              marginLeft:'2px',
              animation:'blink 600ms steps(2) infinite',
            }} />
          )}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 5 — Cards reveal
   ──────────────────────────────────────────────────────── */
function CardsStage({ t, T }) {
  if (t < T.cards.start - 0.1 || t > T.badge.start + 0.4) return null;

  const mount = ease.outQuint(p(t, T.cards.start, T.cards.start + 0.5));
  const countP = p(t, T.cards.start + 0.1, T.cards.start + 0.9);
  const count = Math.round(lerp(0, 12, ease.outCubic(countP)));
  const exit = ease.inCubic(p(t, T.badge.start, T.badge.start + 0.35));

  const cards = [
    { addr:'6044 Westminster',   sub:'Skinker · DeBaliviere', photo:'assets/listing-1-ext.jpg',  px:'$1,395', beds:'2 br',   dist:'0.4 mi',  walk:96, top:true },
    { addr:'Westgate Apt · 1A',  sub:'fully furnished',       photo:'assets/listing-2-int.webp', px:'$1,180', beds:'studio', dist:'0.6 mi',  walk:91 },
    { addr:'Pershing 3BR',       sub:'split w/ roommates',    photo:'assets/listing-3-ext.webp', px:'$  920', beds:'3 br',   dist:'0.9 mi',  walk:88 },
  ];

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 7,
      background:'var(--paper)',
      color:'var(--text)',
      opacity: 1 - exit,
      transform:`translateY(${exit * -4}%)`,
    }}>
      {/* header */}
      <div style={{
        padding:'14cqh 6cqw 0',
        display:'flex', justifyContent:'space-between', alignItems:'flex-end',
        opacity: mount,
        transform:`translateY(${(1-mount)*8}px)`,
      }}>
        <div>
          <div style={{
            fontFamily:'"Inter", sans-serif',
            fontWeight: 700,
            fontSize:'2.2cqw',
            letterSpacing:'.22em',
            textTransform:'uppercase',
            color:'var(--text-2)',
          }}>matches near campus</div>
          <div style={{
            display:'flex', alignItems:'baseline', gap:'1.5cqw',
            marginTop:'.8cqh',
            fontFamily:'"Inter", sans-serif',
            fontWeight: 900,
            fontSize:'13cqw',
            lineHeight:.95,
            letterSpacing:'-.04em',
          }}>
            <span style={{color:'var(--red)'}}>{count}</span>
            <span style={{
              fontFamily:'"Inter", sans-serif',
              fontSize:'3.4cqw',
              color:'var(--text-2)',
              fontWeight:600,
              letterSpacing:'-.01em',
            }}>spots</span>
          </div>
        </div>
        <div style={{
          padding:'.8cqh 2.4cqw',
          background:'var(--red-tint)',
          color:'var(--red)',
          borderRadius:'999px',
          fontSize:'2.4cqw',
          fontWeight:700,
          letterSpacing:'.1em',
          textTransform:'uppercase',
        }}>under budget</div>
      </div>

      {/* listing cards */}
      <div style={{
        marginTop:'3cqh',
        padding:'0 6cqw',
        display:'flex', flexDirection:'column',
        gap:'2.4cqh',
      }}>
        {cards.map((c, i) => {
          const start = T.cards.start + 0.55 + i * 0.18;
          const mP = ease.outBack(p(t, start, start + 0.55));
          return (
            <div key={i} style={{
              transform: `translateY(${(1-mP)*40}px) scale(${0.96 + mP*0.04})`,
              opacity: clamp(mP * 1.2),
              willChange:'transform, opacity',
            }}>
              <ListingCard {...c} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListingCard({ addr, sub, px, beds, dist, walk, photo, top }) {
  return (
    <div style={{
      background:'#fff',
      borderRadius:'3cqw',
      padding:'1.6cqh 2cqw 1.6cqh 1.6cqh',
      display:'flex', alignItems:'stretch', gap:'2.6cqw',
      height:'17cqh',
      border: top ? '1.5px solid var(--text)' : '1px solid var(--line)',
      boxShadow: top
        ? '0 18px 36px -20px rgba(0,0,0,.30)'
        : '0 12px 24px -16px rgba(0,0,0,.18)',
      position:'relative',
    }}>
      {top && (
        <div style={{
          position:'absolute',
          top:'-1.1cqh', left:'2cqw',
          padding:'.5cqh 1.8cqw',
          background:'var(--red)',
          color:'#fff',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 700,
          fontSize:'1.9cqw',
          letterSpacing:'.18em',
          textTransform:'uppercase',
          borderRadius:'999px',
        }}>★ best match</div>
      )}
      {/* thumbnail */}
      <div style={{
        width:'26cqw',
        borderRadius:'2cqw',
        position:'relative',
        overflow:'hidden',
        flexShrink:0,
        background:'var(--red-tint)',
        alignSelf:'stretch',
      }}>
        <img
          src={photo}
          alt=""
          style={{
            position:'absolute', inset:0,
            width:'100%', height:'100%',
            objectFit:'cover',
            display:'block',
          }}
        />
        <div style={{
          position:'absolute', bottom:'.8cqh', left:'.8cqw',
          background:'rgba(10,10,10,.85)',
          color:'#fff',
          padding:'.3cqh 1.2cqw',
          borderRadius:'999px',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 700,
          fontSize:'1.8cqw',
          letterSpacing:'.1em',
          textTransform:'uppercase',
        }}>walk {walk}</div>
      </div>
      {/* meta */}
      <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <div>
          <div style={{
            display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:'2cqw',
          }}>
            <div style={{
              fontSize:'4cqw', fontWeight:700, letterSpacing:'-.01em',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            }}>{addr}</div>
            <div style={{
              fontFamily:'"Inter", sans-serif',
              fontWeight: 900,
              fontSize:'5cqw',
              lineHeight:1,
              whiteSpace:'nowrap',
              color:'var(--red)',
            }}>{px}</div>
          </div>
          <div style={{
            marginTop:'.4cqh',
            fontSize:'2.8cqw',
            fontWeight: 500,
            color:'var(--text-2)',
          }}>{sub}</div>
        </div>
        <div style={{
          marginTop:'1cqh',
          display:'flex', gap:'1.6cqw', alignItems:'center', flexWrap:'wrap',
        }}>
          <Chip dark>{beds}</Chip>
          <Chip>{dist} to campus</Chip>
          <Chip>tour ready</Chip>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, dark }) {
  return (
    <span style={{
      padding:'.5cqh 1.4cqw',
      borderRadius:'999px',
      fontFamily:'"Inter", sans-serif',
      fontWeight: 700,
      fontSize:'2cqw',
      letterSpacing:'.12em',
      textTransform:'uppercase',
      background: dark ? 'var(--text)' : 'var(--red-tint)',
      color: dark ? '#fff' : 'var(--red)',
    }}>{children}</span>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 6 — Stamp: "matched in 4 seconds"
   ──────────────────────────────────────────────────────── */
function BadgeStage({ t, T }) {
  if (t < T.badge.start - 0.1 || t > T.chat.start + 0.4) return null;

  const bgIn = p(t, T.badge.start - 0.15, T.badge.start + 0.2);
  const stampP = ease.outElastic(p(t, T.badge.start + 0.05, T.badge.start + 0.95));
  const exit = ease.inCubic(p(t, T.chat.start - 0.15, T.chat.start + 0.2));

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 8,
      background:'var(--red)',
      opacity: clamp(bgIn) * (1 - exit),
      display:'grid', placeItems:'center',
      overflow:'hidden',
    }}>
      {/* ticker behind */}
      <div style={{
        position:'absolute', inset:0,
        display:'flex', alignItems:'center', justifyContent:'center',
        flexWrap:'wrap',
        opacity:.10, color:'#fff',
        fontFamily:'"Inter", sans-serif',
        fontWeight: 900,
        fontSize:'5.5cqw',
        letterSpacing:'.05em',
        lineHeight:1.6,
        textTransform:'uppercase',
        padding:'4cqw',
        userSelect:'none',
      }}>
        {Array.from({length:18}).map((_,i)=>(
          <span key={i} style={{marginRight:'2cqw'}}>matched ★ </span>
        ))}
      </div>

      <div style={{
        position:'relative',
        transform:`scale(${0.6 + stampP*0.4}) rotate(${(1-stampP) * 14 - 6}deg)`,
        textAlign:'center',
        color:'#fff',
        padding:'0 5cqw',
      }}>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 700,
          fontSize:'3cqw',
          letterSpacing:'.4em',
          textTransform:'uppercase',
          marginBottom:'1.8cqh',
          opacity:.85,
        }}>★ certified ★</div>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 900,
          fontSize:'22cqw',
          lineHeight:.88,
          letterSpacing:'-.045em',
        }}>
          matched in<br/>4 seconds.
        </div>
        <div style={{
          marginTop:'2.4cqh',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 600,
          fontSize:'3.6cqw',
          letterSpacing:'.02em',
          opacity:.95,
        }}>
          not 4 hours of tabs.
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 7 — Chat / tour confirmation
   ──────────────────────────────────────────────────────── */
function ChatStage({ t, T }) {
  if (t < T.chat.start - 0.1 || t > T.logo.start + 0.4) return null;

  const mount = ease.outQuint(p(t, T.chat.start, T.chat.start + 0.4));
  const b1 = p(t, T.chat.start + 0.15, T.chat.start + 0.5);
  const typing = p(t, T.chat.start + 0.65, T.chat.start + 0.95);
  const typingOut = p(t, T.chat.start + 1.1, T.chat.start + 1.25);
  const b2 = p(t, T.chat.start + 1.2, T.chat.start + 1.55);
  const confirm = p(t, T.chat.start + 1.75, T.chat.start + 2.1);
  const exit = ease.inCubic(p(t, T.logo.start - 0.2, T.logo.start + 0.15));

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 7,
      background:'var(--paper)',
      color:'var(--text)',
      opacity: 1 - exit,
      transform:`translateY(${exit * -3}%)`,
    }}>
      {/* header strip */}
      <div style={{
        padding:'14cqh 6cqw 2cqh',
        display:'flex', alignItems:'center', gap:'3cqw',
        opacity: mount,
      }}>
        <div style={{
          width:'10cqw', height:'10cqw', borderRadius:'50%',
          background:'var(--red)',
          display:'grid', placeItems:'center',
          color:'#fff',
          padding:'1.6cqw',
        }}>
          <BrandMark color="#fff" />
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800, fontSize:'3.8cqw', letterSpacing:'-.01em'}}>Proximity Concierge</div>
          <div style={{
            display:'flex', alignItems:'center', gap:'1cqw',
            fontFamily:'"Inter", sans-serif',
            fontWeight: 600,
            fontSize:'2.2cqw',
            color:'var(--text-2)',
            textTransform:'uppercase',
            letterSpacing:'.16em',
            marginTop:'.2cqh',
          }}>
            <span style={{width:'1.4cqw',height:'1.4cqw',borderRadius:'50%',background:'#3CC07A'}} />
            replying live
          </div>
        </div>
      </div>

      {/* bubbles */}
      <div style={{
        padding:'2cqh 6cqw',
        display:'flex', flexDirection:'column',
        gap:'2cqh',
      }}>
        <Bubble side="left" enter={b1}>
          <strong>Hey Maya 👋</strong>
          <div style={{marginTop:'.6cqh'}}>
            Owner at <strong>6044 Westminster</strong> approved a tour <strong>Saturday 2pm</strong>. Lock it in?
          </div>
        </Bubble>

        {typing > 0 && typing < 1 && typingOut < 1 && (
          <div style={{alignSelf:'flex-end', opacity: 1 - typingOut}}>
            <div style={{
              background:'#fff',
              border:'1px solid var(--line)',
              padding:'1.4cqh 2.4cqw',
              borderRadius:'4cqw 4cqw 1cqw 4cqw',
              display:'flex', gap:'1cqw',
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width:'1.4cqw', height:'1.4cqw',
                  borderRadius:'50%',
                  background:'var(--text-2)',
                  opacity: 0.3 + 0.7 * Math.abs(Math.sin(t * 6 - i * 0.6)),
                }} />
              ))}
            </div>
          </div>
        )}

        {b2 > 0 && <Bubble side="right" enter={b2} red>
          yes please 🙏
        </Bubble>}

        {confirm > 0 && (
          <div style={{
            marginTop:'1cqh',
            background:'var(--text)',
            color:'#fff',
            borderRadius:'3cqw',
            padding:'2.2cqh 3cqw',
            transform: `translateY(${(1-confirm)*30}px)`,
            opacity: confirm,
            display:'flex', alignItems:'center', gap:'2.5cqw',
          }}>
            <div style={{
              width:'8cqw', height:'8cqw', borderRadius:'50%',
              background:'var(--red)',
              display:'grid', placeItems:'center',
              fontSize:'4.5cqw',
              fontWeight: 900,
            }}>✓</div>
            <div>
              <div style={{
                fontFamily:'"Inter", sans-serif',
                fontWeight: 700,
                fontSize:'2cqw',
                letterSpacing:'.22em',
                textTransform:'uppercase',
                opacity:.6,
              }}>tour confirmed</div>
              <div style={{
                fontFamily:'"Inter", sans-serif',
                fontWeight: 900,
                fontSize:'5.5cqw',
                lineHeight:1,
                marginTop:'.4cqh',
                letterSpacing:'-.02em',
              }}>Sat · 2:00pm</div>
            </div>
            <div style={{flex:1}} />
            <div style={{
              padding:'.8cqh 1.8cqw',
              border:'1px solid rgba(255,255,255,.25)',
              borderRadius:'999px',
              fontSize:'2.2cqw',
              fontWeight: 700,
              fontFamily:'"Inter", sans-serif',
              textTransform:'uppercase',
              letterSpacing:'.14em',
            }}>added · cal</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Bubble({ children, side, enter, red }) {
  const alignSelf = side === 'left' ? 'flex-start' : 'flex-end';
  const radius = side === 'left'
    ? '4cqw 4cqw 4cqw 1cqw'
    : '4cqw 4cqw 1cqw 4cqw';
  return (
    <div style={{
      alignSelf,
      maxWidth:'78%',
      transform: `translateY(${(1-enter)*20}px)`,
      opacity: enter,
    }}>
      <div style={{
        background: red ? 'var(--red)' : '#fff',
        color: red ? '#fff' : 'var(--text)',
        border: red ? 'none' : '1px solid var(--line)',
        padding:'1.6cqh 2.8cqw',
        borderRadius: radius,
        fontFamily:'"Inter", sans-serif',
        fontWeight: 500,
        fontSize:'3.4cqw',
        lineHeight:1.35,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   STAGE 8 — Logo lockup + tagline + CTA URL
   ──────────────────────────────────────────────────────── */
function LogoStage({ t, T }) {
  if (t < T.logo.start - 0.1) return null;

  const mount = ease.outQuint(p(t, T.logo.start, T.logo.start + 0.6));
  const tag  = p(t, T.logo.start + 0.55, T.logo.start + 1.1);
  const cta  = p(t, T.logo.start + 0.95, T.logo.start + 1.45);

  const letters = "proximity".split("");

  return (
    <div style={{
      position:'absolute', inset:0, zIndex: 9,
      background:'#0A0A0A',
      color:'#fff',
      opacity: mount,
      display:'grid',
      gridTemplateRows:'1fr auto 1fr',
      padding:'10cqh 6cqw 7cqh',
    }}>
      {/* top spacer (chrome handles logo) */}
      <div />

      {/* center */}
      <div style={{textAlign:'center'}}>
        <div style={{
          display:'grid', placeItems:'center',
          marginBottom:'2.4cqh',
          opacity: mount,
        }}>
          <div style={{
            width:'24cqw', height:'24cqw',
            color:'var(--red)',
            transform:`scale(${0.7 + mount*0.3}) rotate(${(1-mount)*-18}deg)`,
          }}>
            <BrandMark color="currentColor" />
          </div>
        </div>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 900,
          fontSize:'20cqw',
          lineHeight:.9,
          letterSpacing:'-.055em',
          display:'flex',
          justifyContent:'center',
          gap:'.005em',
        }}>
          {letters.map((ch, i) => {
            const start = T.logo.start + 0.15 + i * 0.04;
            const lp = ease.outBack(p(t, start, start + 0.45));
            return (
              <span key={i} style={{
                display:'inline-block',
                transform: `translateY(${(1-lp)*40}%)`,
                opacity: clamp(lp * 1.4),
              }}>{ch}</span>
            );
          })}
        </div>
        <div style={{
          marginTop:'3.5cqh',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 500,
          fontSize:'4.6cqw',
          letterSpacing:'-.015em',
          opacity: tag,
          transform: `translateY(${(1-tag)*16}px)`,
          color:'rgba(255,255,255,.92)',
        }}>
          Find your place. <span style={{color:'var(--red)'}}>Skip the chaos.</span>
        </div>
      </div>

      {/* bottom: CTA url */}
      <div style={{
        alignSelf:'end',
        display:'flex', flexDirection:'column', alignItems:'center', gap:'1.6cqh',
        opacity: cta,
        transform: `translateY(${(1-cta)*20}px)`,
      }}>
        <div style={{
          padding:'2.6cqh 5cqw',
          background:'var(--red)',
          color:'#fff',
          borderRadius:'999px',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 800,
          fontSize:'4.2cqw',
          letterSpacing:'-.01em',
        }}>useproximity.org/matchmaking</div>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 700,
          fontSize:'2.4cqw',
          letterSpacing:'.24em',
          textTransform:'uppercase',
          color:'rgba(255,255,255,.5)',
        }}>free for WashU students</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Chrome — persistent logo top-left + "FOR WASHU STUDENTS"
   ──────────────────────────────────────────────────────── */
function Chrome({ t, T, visible }) {
  if (!visible) return null;
  const scene = sceneAt(t, T);
  const onDark = scene === 'video' || scene === 'red' || scene === 'darkClosing';
  const fg = onDark ? '#FFFFFF' : '#0A0A0A';
  // subtle fade in
  const inP = clamp((t - 0.2) / 0.4);
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:30,
      pointerEvents:'none',
      padding:'4cqh 5.5cqw 0',
      display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      opacity: inP,
      transition:'opacity 220ms ease',
      color: fg,
      mixBlendMode: 'normal',
    }}>
      {/* logo top-left */}
      <div style={{display:'flex', alignItems:'center', gap:'1.6cqw'}}>
        <div style={{
          width:'7.5cqw', height:'7.5cqw',
          color:'var(--red)',
          filter: onDark ? 'drop-shadow(0 1px 4px rgba(0,0,0,.4))' : 'none',
        }}>
          <BrandMark color="currentColor" />
        </div>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 900,
          fontSize:'4.6cqw',
          letterSpacing:'-.03em',
          textShadow: onDark ? '0 1px 8px rgba(0,0,0,.35)' : 'none',
        }}>proximity</div>
      </div>
      {/* badge top-right */}
      <div style={{
        padding:'.7cqh 2cqw',
        border:`1.5px solid ${fg}`,
        background: onDark ? 'rgba(0,0,0,.20)' : 'transparent',
        backdropFilter: onDark ? 'blur(4px)' : 'none',
        borderRadius:'999px',
        fontFamily:'"Inter", sans-serif',
        fontWeight: 700,
        fontSize:'2cqw',
        letterSpacing:'.20em',
        textTransform:'uppercase',
        whiteSpace:'nowrap',
      }}>for WashU students</div>
    </div>
  );
}

/* expose to App */
Object.assign(window, {
  BrandMark, Chrome,
  VideoStage, FadeStage, HeadlineStage, FormStage,
  CardsStage, BadgeStage, ChatStage, LogoStage,
  clamp, p, lerp, ease, sceneAt,
});
