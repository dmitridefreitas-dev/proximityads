import { useCurrentFrame, interpolate, spring, Img, staticFile, Audio, Sequence } from "remotion";
import { BRAND, type Theme } from "../brand";
import { Cursor } from "../components/Cursor";
import { click, pop, softTick } from "../sounds";

export const DetailView: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();

  const clickCursorOpacity = interpolate(frame, [0, 4, 8, 14], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clickCursorScale = interpolate(frame, [4, 8], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const enterP = spring({ frame: Math.max(0, frame - 8), fps: 30, config: { damping: 12, stiffness: 50, mass: 1.2 } });
  const scaleIn = interpolate(enterP, [0, 1], [0.88, 1]);
  const rotateX = interpolate(enterP, [0, 0.5, 1], [10, 1.5, 0]);

  const writeupP = spring({ frame: Math.max(0, frame - 30), fps: 30, config: { damping: 11, stiffness: 50, mass: 1 } });
  const chatP = spring({ frame: Math.max(0, frame - 65), fps: 30, config: { damping: 11, stiffness: 50, mass: 1 } });
  const tradeoffP = spring({ frame: Math.max(0, frame - 95), fps: 30, config: { damping: 11, stiffness: 50, mass: 1 } });

  const exitP = interpolate(frame, [165, 198], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const w = 920;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        opacity: 1 - exitP,
        transform: `scale(${interpolate(exitP, [0, 1], [1, 0.9])})`,
        perspective: 2200,
        overflow: "hidden",
        gap: 16,
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.red}0C, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Cursor click */}
      <div
        style={{
          position: "absolute",
          top: "32%",
          left: "56%",
          opacity: clickCursorOpacity,
          transform: `scale(${clickCursorScale})`,
          zIndex: 20,
        }}
      >
        <Cursor scale={1.5} />
      </div>

      {/* Listing card */}
      <div
        style={{
          width: w,
          transform: `scale(${scaleIn}) rotateX(${rotateX}deg)`,
          opacity: enterP,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 320,
            borderRadius: 28,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 80px ${BRAND.red}08`,
          }}
        >
          <Img src={staticFile("KingsburyAve.avif")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: BRAND.red,
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              padding: "7px 16px",
              borderRadius: 8,
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            Top Pick
          </div>
          <div style={{ position: "absolute", bottom: 0, width: "100%", height: 100, background: `linear-gradient(transparent, ${theme.bg}CC)` }} />
        </div>

        <div style={{ padding: "22px 4px 0" }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: theme.text, letterSpacing: -0.5 }}>Kingsbury Ave</div>
          <div style={{ fontSize: 20, color: theme.sub, marginTop: 4 }}>
            Manor Real Estate · 3 bed · ~$733/person/mo
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {[
              { to: "Brookings", time: "10 min" },
              { to: "The Loop", time: "10 min" },
              { to: "Olin Library", time: "12 min" },
            ].map((ww) => (
              <div
                key={ww.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: theme.fieldBg,
                  borderRadius: 10,
                  padding: "10px 16px",
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: BRAND.red, flexShrink: 0 }} />
                <span style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{ww.time}</span>
                <span style={{ fontSize: 16, color: theme.sub }}>to {ww.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why it fits */}
      <div
        style={{
          width: w,
          opacity: writeupP,
          transform: `translateY(${interpolate(writeupP, [0, 1], [40, 0])}px)`,
          background: theme.card,
          borderRadius: 22,
          padding: "24px 28px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: `0 8px 30px rgba(0,0,0,0.15)`,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, color: BRAND.red, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>
          Why this is a great fit
        </div>
        <div style={{ fontSize: 20, color: theme.text, lineHeight: 1.6 }}>
          Under your $750/person budget, walkable to campus,
          and has <span style={{ fontWeight: 700 }}>in-unit laundry</span> — your
          top priority. Students rate it 5 stars.
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          width: w,
          opacity: chatP,
          transform: `translateY(${interpolate(chatP, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            background: theme.card,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 18,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: `0 6px 24px rgba(0,0,0,0.12)`,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${BRAND.red}, #C62E24)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#fff",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 19, color: theme.sub }}>
            Want to see something different? Ask me anything.
          </div>
        </div>
      </div>

      {/* Tradeoff */}
      <div
        style={{
          width: w,
          opacity: tradeoffP,
          transform: `scale(${interpolate(tradeoffP, [0, 1], [0.92, 1])})`,
          background: `${BRAND.red}0A`,
          border: `1.5px solid ${BRAND.red}25`,
          borderRadius: 18,
          padding: "20px 24px",
          boxShadow: `0 6px 30px ${BRAND.red}08`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, color: BRAND.red, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>
          Suggested tradeoff
        </div>
        <div style={{ fontSize: 20, color: theme.text, lineHeight: 1.5 }}>
          Would you pay $100/mo more for a gym and in-unit laundry?
        </div>
      </div>

      {/* Audio */}
      <Sequence from={5} durationInFrames={8}>
        <Audio src={click()} volume={0.25} />
      </Sequence>
      <Sequence from={12} durationInFrames={8}>
        <Audio src={softTick()} volume={0.15} />
      </Sequence>
      <Sequence from={32} durationInFrames={8}>
        <Audio src={pop()} volume={0.15} />
      </Sequence>
      <Sequence from={67} durationInFrames={8}>
        <Audio src={pop()} volume={0.12} />
      </Sequence>
      <Sequence from={97} durationInFrames={8}>
        <Audio src={pop()} volume={0.15} />
      </Sequence>
    </div>
  );
};
