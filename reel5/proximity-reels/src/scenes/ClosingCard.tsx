import { useCurrentFrame, interpolate, spring, Img, staticFile, Audio, Sequence } from "remotion";
import { BRAND, type Theme } from "../brand";
import { ding, reveal } from "../sounds";

export const ClosingCard: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();

  const logoP = spring({ frame, fps: 30, config: { damping: 10, stiffness: 40, mass: 1.3 } });
  const logoScale = interpolate(logoP, [0, 1], [0.4, 1]);
  const logoRotY = interpolate(logoP, [0, 0.5, 1], [80, 8, 0]);

  const tagP = spring({ frame: Math.max(0, frame - 15), fps: 30, config: { damping: 10, stiffness: 38, mass: 1.2 } });
  const tagY = interpolate(tagP, [0, 1], [50, 0]);

  const ctaP = spring({ frame: Math.max(0, frame - 35), fps: 30, config: { damping: 10, stiffness: 38, mass: 1.2 } });
  const ctaPulse = interpolate(frame % 50, [0, 25, 50], [1, 1.03, 1]);

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
        gap: 52,
        perspective: 1500,
        overflow: "hidden",
      }}
    >
      {/* Red glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.red}14, transparent 60%)`,
          filter: "blur(100px)",
          opacity: logoP,
        }}
      />

      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${theme.cardBorder}40 1px, transparent 1px),
            linear-gradient(90deg, ${theme.cardBorder}40 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          transform: "perspective(800px) rotateX(60deg)",
          transformOrigin: "center 120%",
          opacity: 0.3,
          maskImage: "linear-gradient(transparent 20%, black 80%)",
          WebkitMaskImage: "linear-gradient(transparent 20%, black 80%)",
        }}
      />

      {/* Logo */}
      <div style={{ transform: `scale(${logoScale}) rotateY(${logoRotY}deg)`, opacity: logoP }}>
        <Img
          src={staticFile("logo.svg")}
          style={{ width: 160, height: 160, filter: `drop-shadow(0 8px 40px ${BRAND.red}20)` }}
        />
      </div>

      {/* Tagline */}
      <div style={{ opacity: tagP, transform: `translateY(${tagY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: theme.text, lineHeight: 1.15, letterSpacing: -1 }}>
          Find your place.
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: BRAND.red,
            lineHeight: 1.15,
            letterSpacing: -1,
            textShadow: `0 4px 50px ${BRAND.red}20`,
          }}
        >
          Skip the chaos.
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaP,
          transform: `scale(${interpolate(ctaP, [0, 1], [0.85, 1]) * ctaPulse})`,
          background: `linear-gradient(135deg, ${BRAND.red}, #C62E24)`,
          color: "#fff",
          fontWeight: 800,
          fontSize: 28,
          padding: "22px 52px",
          borderRadius: 16,
          boxShadow: `0 12px 50px ${BRAND.red}30`,
          letterSpacing: 0.3,
        }}
      >
        useproximity.org/matchmaking
      </div>

      {/* Audio */}
      <Sequence from={0} durationInFrames={18}>
        <Audio src={reveal()} volume={0.25} />
      </Sequence>
      <Sequence from={18} durationInFrames={18}>
        <Audio src={ding()} volume={0.2} />
      </Sequence>
    </div>
  );
};
