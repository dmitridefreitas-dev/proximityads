/* ─────────────────────────────────────────────────────────────
   Proximity ad — app.jsx
   Orchestrator: tap-to-play, time loop, restart, full sequence.
   ───────────────────────────────────────────────────────────── */

const { useEffect, useState, useRef, useMemo } = React;

const VIDEO_CAP = 7.0;

function buildTimeline(videoDuration) {
  const fadeStart = Math.min(videoDuration, VIDEO_CAP) - 0.2;
  return {
    video:    { start: 0,                 end: fadeStart },
    fade:     { start: fadeStart },                                   // ~0.7s soft fade
    headline: { start: fadeStart + 0.65, end: fadeStart + 3.0 },      // ~2.35s
    form:     { start: fadeStart + 2.85 },                            // ~3.3s
    cards:    { start: fadeStart + 6.15 },                            // ~3.4s
    badge:    { start: fadeStart + 9.55 },                            // ~1.5s
    chat:     { start: fadeStart + 11.05 },                           // ~2.7s
    logo:     { start: fadeStart + 13.75 },                           // ~3.4s
    end:      fadeStart + 17.0,
  };
}

/* ── default tweaks ─────────────────────────────────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "light",
  "accent":  "#E23A2F",
  "showChrome": true,
  "ctaUrl": "useproximity.org/matchmaking"
}/*EDITMODE-END*/;

function App() {
  const videoRef = useRef(null);
  const sfxRef = useRef(null);
  const firedRef = useRef(new Set());
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState(5.0);
  const [t, setT] = useState(0);
  const [done, setDone] = useState(false);
  const tweaks = useTweaks(TWEAK_DEFAULTS);

  const T = useMemo(() => buildTimeline(duration), [duration]);

  /* ── grab video duration; cap at 5s ─────────────────── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      if (v.duration && isFinite(v.duration)) {
        setDuration(Math.min(v.duration, VIDEO_CAP));
      }
    };
    v.addEventListener('loadedmetadata', onMeta);
    if (v.readyState >= 1) onMeta();
    return () => v.removeEventListener('loadedmetadata', onMeta);
  }, []);

  /* ── loop the video audio as ambient bed past the visual cap ─ */
  useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    if (!v) return;
    v.loop = true; // keep the cinematic audio bed alive for the whole ad
  }, [started]);

  /* ── SFX: duck the bed + fire layered hits on each beat ── */
  useEffect(() => {
    const sfx = sfxRef.current;
    if (!sfx || !started || done) return;
    const fired = firedRef.current;
    const fire = (key, time, fn) => {
      if (t >= time && !fired.has(key)) {
        fired.add(key);
        fn();
      }
    };

    fire('ambient',   T.fade.start + 0.3,  () => sfx.goAmbient());

    fire('headline1', T.headline.start + 0.00, () => sfx.tick(520));
    fire('headline2', T.headline.start + 0.12, () => sfx.tick(620));
    fire('headline3', T.headline.start + 0.24, () => sfx.tick(820));
    fire('headline4', T.headline.start + 0.36, () => sfx.pop());

    fire('formOpen',  T.form.start + 0.0,   () => sfx.whoosh({ pitch:'high' }));
    fire('field1',    T.form.start + 0.40,  () => sfx.tick(1100));
    fire('field1b',   T.form.start + 0.75,  () => sfx.keyTap());
    fire('field2',    T.form.start + 1.05,  () => sfx.tick(1100));
    fire('field2b',   T.form.start + 1.40,  () => sfx.keyTap());
    fire('field3',    T.form.start + 1.70,  () => sfx.tick(1100));
    fire('field3b',   T.form.start + 2.05,  () => sfx.keyTap());
    fire('formBtn',   T.form.start + 2.55,  () => sfx.pop());

    fire('cardsHdr',  T.cards.start + 0.05, () => sfx.tick(440));
    fire('card1',     T.cards.start + 0.55, () => sfx.whoosh());
    fire('card2',     T.cards.start + 0.73, () => sfx.whoosh({ pitch:'low' }));
    fire('card3',     T.cards.start + 0.91, () => sfx.whoosh({ pitch:'mid' }));

    fire('badgeIn',   T.badge.start - 0.05, () => sfx.swell());
    fire('badgeHit',  T.badge.start + 0.08, () => sfx.thump());

    fire('chatOpen',  T.chat.start + 0.00,  () => sfx.whoosh({ pitch:'high' }));
    fire('chat1',     T.chat.start + 0.20,  () => sfx.ding(900));
    fire('chat2',     T.chat.start + 1.25,  () => sfx.ding(700));
    fire('confirm',   T.chat.start + 1.80,  () => sfx.ding(1500));

    fire('riser',     T.logo.start - 0.4,   () => sfx.riser());
  }, [t, T, started, done]);

  /* ── fade out the audio bed when ad ends ─────────────── */
  useEffect(() => {
    if (!done) return;
    const sfx = sfxRef.current;
    if (sfx) sfx.bedOut(1.2);
    const v = videoRef.current;
    if (v) setTimeout(() => { try { v.pause(); } catch {} }, 1300);
  }, [done]);

  /* ── time loop ─────────────────────────────────────── */
  useEffect(() => {
    if (!started) return;
    let raf;
    const startNow = performance.now();
    const tick = (now) => {
      const elapsed = (now - startNow) / 1000;
      setT(elapsed);
      if (elapsed >= T.end + 0.5) {
        setDone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, T.end]);

  /* ── theme: applies CSS variable overrides ─────────── */
  const themeStyle = tweaks.variant === 'dark'
    ? { '--paper': '#0A0A0A', '--text': '#FFFFFF', '--text-2': '#9A9A9A', '--line': 'rgba(255,255,255,.14)', '--red-tint': 'rgba(226,58,47,.16)', '--red': tweaks.accent || '#E23A2F' }
    : { '--paper': '#FAFAFA', '--text': '#0A0A0A', '--text-2': '#555555', '--line': 'rgba(10,10,10,.10)', '--red-tint': '#FBE6E4', '--red': tweaks.accent || '#E23A2F' };

  /* ── kick off everything (also unlocks Web Audio) ─────── */
  const begin = async () => {
    const v = videoRef.current;
    if (!v) return;

    // Build/attach the SFX engine on first user gesture
    if (!sfxRef.current) {
      sfxRef.current = new SfxEngine();
      sfxRef.current.ensureCtx();
      sfxRef.current.attachVideo(v);
    } else {
      try { await sfxRef.current.ctx.resume(); } catch {}
      sfxRef.current.reset();
      sfxRef.current.goForeground();
    }
    firedRef.current = new Set();

    try {
      v.currentTime = 0;
      v.loop = true;
      v.muted = false;
      v.volume = 1;
      await v.play();
    } catch (err) {
      v.muted = true;
      try { await v.play(); } catch {}
    }
    setStarted(true);
    setDone(false);
    setT(0);
  };

  const restart = () => {
    setStarted(false);
    setDone(false);
    setT(0);
    const v = videoRef.current;
    if (v) { try { v.pause(); v.currentTime = 0; } catch {} }
    setTimeout(begin, 60);
  };

  return (
    <>
      <div className="stage" style={themeStyle} data-variant={tweaks.variant}>
        <VideoStage t={t} T={T} videoRef={videoRef} />
        <FadeStage t={t} T={T} />
        <HeadlineStage t={t} T={T} />
        <FormStage t={t} T={T} />
        <CardsStage t={t} T={T} />
        <BadgeStage t={t} T={T} />
        <ChatStage t={t} T={T} />
        <LogoStage t={t} T={T} />

        {/* Persistent brand chrome — hides during splash, end-card, and final logo lockup */}
        <Chrome t={t} T={T} visible={tweaks.showChrome && started && !done && t < T.logo.start - 0.1} />

        {!started && <Splash onBegin={begin} />}
        {done && <EndOverlay onRestart={restart} ctaUrl={tweaks.ctaUrl} />}
      </div>


      <TweaksPanelHost tweaks={tweaks} />

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes pulse {
          0% { transform: scale(1); opacity: .7; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </>
  );
}

/* ── Tweaks panel ────────────────────────────────────── */
function TweaksPanelHost({ tweaks }) {
  const { setTweak } = tweaks;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Hero variant (A/B)">
        <TweakRadio
          label="Background"
          value={tweaks.variant}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark',  label: 'Dark' },
          ]}
          onChange={(v) => setTweak('variant', v)}
        />
      </TweakSection>
      <TweakSection label="Accent">
        <TweakColor
          label="Brand red"
          value={tweaks.accent}
          options={['#E23A2F', '#C72A20', '#FF4A3D']}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>
      <TweakSection label="Chrome">
        <TweakToggle
          label="Logo + WashU badge"
          value={tweaks.showChrome}
          onChange={(v) => setTweak('showChrome', v)}
        />
      </TweakSection>
      <TweakSection label="CTA url">
        <TweakText
          label="End-card link"
          value={tweaks.ctaUrl}
          onChange={(v) => setTweak('ctaUrl', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ── Splash (required so audio can play) ─────────────── */
function Splash({ onBegin }) {
  return (
    <div
      onClick={onBegin}
      style={{
        position:'absolute', inset:0, zIndex:50,
        background:'#0A0A0B',
        display:'grid', placeItems:'center',
        cursor:'pointer',
        overflow:'hidden',
      }}
    >
      <div style={{
        position:'absolute', inset:0,
        display:'grid', placeItems:'center',
        opacity:.06, color:'#fff',
      }}>
        <div style={{width:'160cqw', height:'160cqw'}}>
          <BrandMark color="currentColor" />
        </div>
      </div>

      <div style={{
        position:'relative',
        textAlign:'center',
        color:'#fff',
        padding:'0 8cqw',
      }}>
        <div style={{
          width:'14cqw', height:'14cqw',
          margin:'0 auto 4cqh',
          color:'#E23A2F',
        }}>
          <BrandMark color="currentColor" />
        </div>
        <div style={{
          fontFamily:'"Inter", sans-serif',
          fontWeight: 900,
          fontSize:'10cqw',
          lineHeight:.95,
          letterSpacing:'-.04em',
        }}>proximity</div>
        <div style={{
          marginTop:'1.5cqh',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 700,
          fontSize:'2.6cqw',
          letterSpacing:'.32em',
          textTransform:'uppercase',
          color:'rgba(255,255,255,.55)',
        }}>:20 spot · sound on</div>

        <div style={{
          marginTop:'10cqh',
          display:'inline-flex',
          alignItems:'center', justifyContent:'center',
          width:'18cqw', height:'18cqw',
          borderRadius:'50%',
          background:'#E23A2F',
          position:'relative',
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '4.5cqw solid #fff',
            borderTop: '2.8cqw solid transparent',
            borderBottom: '2.8cqw solid transparent',
            marginLeft: '1.2cqw',
          }} />
          <span style={{
            position:'absolute', inset:0,
            borderRadius:'50%',
            background:'#E23A2F',
            animation:'pulse 1.8s ease-out infinite',
            zIndex:-1,
          }} />
        </div>
        <div style={{
          marginTop:'3cqh',
          fontFamily:'"Inter", sans-serif',
          fontWeight: 500,
          fontSize:'3.2cqw',
          color:'rgba(255,255,255,.7)',
        }}>tap to play with sound</div>
      </div>
    </div>
  );
}

/* ── End overlay (replay) ────────────────────────────── */
function EndOverlay({ onRestart, ctaUrl }) {
  return (
    <div
      onClick={onRestart}
      style={{
        position:'absolute', inset:0, zIndex:60,
        background:'transparent',
        cursor:'pointer',
        display:'grid', placeItems:'end center',
        paddingBottom:'4cqh',
      }}
    >
      <div style={{
        padding:'1.6cqh 4cqw',
        background:'rgba(255,255,255,.10)',
        border:'1px solid rgba(255,255,255,.20)',
        backdropFilter:'blur(10px)',
        color:'#fff',
        borderRadius:'999px',
        fontFamily:'"Inter", sans-serif',
        fontWeight: 700,
        fontSize:'2.8cqw',
        letterSpacing:'.2em',
        textTransform:'uppercase',
      }}>↻ tap to replay</div>
    </div>
  );
}

/* ── boot ────────────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
