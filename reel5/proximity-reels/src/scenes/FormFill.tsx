import { useCurrentFrame, interpolate, spring, Audio, Sequence } from "remotion";
import { BRAND, type Theme } from "../brand";
import { Cursor } from "../components/Cursor";
import { softTick, click, pop, whoosh } from "../sounds";

const FIELDS = [
  { label: "Budget", value: "$750 / person / month", enterAt: 15 },
  { label: "Move-in date", value: "August 15, 2026", enterAt: 28 },
  { label: "Group size", value: "3", enterAt: 39 },
  { label: "Pets", value: "No", enterAt: 48 },
  { label: "Commute mode", value: "Walk", enterAt: 56 },
] as const;

const CHIPS = ["Walk to campus", "In-unit laundry"] as const;

export const FormFill: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();

  const enterP = spring({ frame, fps: 30, config: { damping: 13, stiffness: 55, mass: 1.1 } });
  const formY = interpolate(enterP, [0, 1], [200, 0]);
  const formRotateX = interpolate(enterP, [0, 0.6, 1], [8, 1, 0]);

  const submitGlow = interpolate(frame, [120, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorOpacity = interpolate(frame, [123, 128, 135, 140], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [128, 133], [0, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnPress = frame >= 130 && frame <= 135 ? 0.97 : 1;

  const redWashOpacity = interpolate(frame, [135, 143, 172, 188], [0, 0.95, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thinkingOpacity = interpolate(frame, [143, 153], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dot1 = interpolate(frame % 18, [0, 9, 18], [0.25, 1, 0.25]);
  const dot2 = interpolate((frame + 6) % 18, [0, 9, 18], [0.25, 1, 0.25]);
  const dot3 = interpolate((frame + 12) % 18, [0, 9, 18], [0.25, 1, 0.25]);

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
        position: "relative",
        perspective: 2000,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.red}0C, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Form container */}
      <div
        style={{
          width: 820,
          transform: `translateY(${formY}px) rotateX(${formRotateX}deg)`,
          opacity: enterP,
          transformStyle: "preserve-3d",
          background: theme.card,
          borderRadius: 36,
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px ${theme.cardBorder}, 0 0 120px ${BRAND.red}08`,
          padding: "48px 44px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.red, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
            Matchmaking
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: theme.text, letterSpacing: -0.5 }}>
            Tell us what you need
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: theme.cardBorder, margin: "20px 0 28px" }} />

        {/* Fields */}
        {FIELDS.map((field) => {
          const p = spring({
            frame: Math.max(0, frame - field.enterAt),
            fps: 30,
            config: { damping: 16, stiffness: 140 },
          });
          return (
            <div
              key={field.label}
              style={{
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [20, 0])}px)`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.sub,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  background: theme.fieldBg,
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontSize: 22,
                  fontWeight: 600,
                  color: theme.text,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                {field.value}
              </div>
            </div>
          );
        })}

        {/* Priority chips */}
        <div style={{ display: "flex", gap: 12, marginTop: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {CHIPS.map((chip, i) => {
            const chipP = spring({
              frame: Math.max(0, frame - 66 - i * 8),
              fps: 30,
              config: { damping: 14, stiffness: 100 },
            });
            return (
              <div
                key={chip}
                style={{
                  opacity: chipP,
                  transform: `scale(${interpolate(chipP, [0, 1], [0.85, 1])})`,
                  background: `${BRAND.red}15`,
                  color: BRAND.red,
                  fontWeight: 700,
                  fontSize: 18,
                  padding: "10px 22px",
                  borderRadius: 24,
                  border: `1.5px solid ${BRAND.red}40`,
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div
          style={{
            background: BRAND.red,
            color: "#fff",
            fontWeight: 800,
            fontSize: 22,
            textAlign: "center",
            padding: "18px 0",
            borderRadius: 14,
            transform: `scale(${btnPress})`,
            boxShadow: submitGlow > 0
              ? `0 8px 30px ${BRAND.red}40, 0 0 ${60 * submitGlow}px ${BRAND.red}${Math.round(40 * submitGlow).toString(16).padStart(2, "0")}`
              : `0 4px 20px ${BRAND.red}25`,
            position: "relative",
            letterSpacing: 0.3,
          }}
        >
          Get My Recommendations
          <div
            style={{
              position: "absolute",
              right: 32,
              top: "50%",
              transform: `translateY(calc(-50% + ${cursorY}px))`,
              opacity: cursorOpacity,
            }}
          >
            <Cursor scale={1.3} />
          </div>
        </div>
      </div>

      {/* Red wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, ${BRAND.red}, ${BRAND.red}E0)`,
          opacity: redWashOpacity,
          zIndex: 10,
        }}
      />

      {/* Thinking */}
      {frame >= 143 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11,
            opacity: thinkingOpacity,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700, color: frame >= 153 ? theme.text : "#fff", marginBottom: 36, letterSpacing: 1 }}>
            Finding your matches
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[dot1, dot2, dot3].map((o, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: BRAND.red,
                  opacity: o,
                  boxShadow: `0 0 ${16 * o}px ${BRAND.red}50`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Audio */}
      <Sequence from={0} durationInFrames={15}>
        <Audio src={whoosh()} volume={0.2} />
      </Sequence>
      {FIELDS.map((f) => (
        <Sequence key={f.label} from={f.enterAt} durationInFrames={6}>
          <Audio src={softTick()} volume={0.2} />
        </Sequence>
      ))}
      <Sequence from={66} durationInFrames={6}>
        <Audio src={pop()} volume={0.15} />
      </Sequence>
      <Sequence from={74} durationInFrames={6}>
        <Audio src={pop()} volume={0.15} />
      </Sequence>
      <Sequence from={130} durationInFrames={8}>
        <Audio src={click()} volume={0.3} />
      </Sequence>
    </div>
  );
};
