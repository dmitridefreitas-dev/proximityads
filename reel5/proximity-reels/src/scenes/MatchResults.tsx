import { useCurrentFrame, interpolate, spring, Img, staticFile, Audio, Sequence } from "remotion";
import { BRAND, type Theme } from "../brand";
import { ding, reveal, pop } from "../sounds";

export const MatchResults: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();

  const card1P = spring({ frame, fps: 30, config: { damping: 12, stiffness: 50, mass: 1.2 } });
  const card1Y = interpolate(card1P, [0, 1], [600, 0]);
  const card1RotX = interpolate(card1P, [0, 0.5, 1], [14, 2, 0]);

  const card2P = spring({ frame: Math.max(0, frame - 14), fps: 30, config: { damping: 12, stiffness: 50, mass: 1.2 } });
  const card2Y = interpolate(card2P, [0, 1], [600, 0]);
  const card2RotX = interpolate(card2P, [0, 0.5, 1], [14, 2, 0]);

  const reviewP = spring({ frame: Math.max(0, frame - 50), fps: 30, config: { damping: 12, stiffness: 60 } });
  const scanP = spring({ frame: Math.max(0, frame - 75), fps: 30, config: { damping: 12, stiffness: 80 } });

  const exitP = interpolate(frame, [180, 208], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const W = 920;
  const IMG_H = 220;

  const cardShell = (isTop: boolean): React.CSSProperties => ({
    background: theme.card,
    borderRadius: 28,
    border: `1.5px solid ${isTop ? `${BRAND.red}50` : theme.cardBorder}`,
    width: W,
    overflow: "hidden",
    boxShadow: isTop
      ? `0 16px 60px ${BRAND.red}18, 0 0 0 1px ${BRAND.red}10`
      : `0 10px 40px rgba(0,0,0,0.2), 0 0 0 1px ${theme.cardBorder}`,
    position: "relative" as const,
  });

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
        gap: 32,
        fontFamily: "Inter, sans-serif",
        opacity: 1 - exitP,
        transform: `scale(${interpolate(exitP, [0, 1], [1, 0.9])})`,
        perspective: 2000,
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.red}0C, transparent 65%)`,
          filter: "blur(80px)",
        }}
      />

      <div style={{ fontSize: 16, fontWeight: 700, color: theme.sub, letterSpacing: 3, textTransform: "uppercase" }}>
        Your Matches
      </div>

      {/* TOP PICK */}
      <div style={{ transform: `translateY(${card1Y}px) rotateX(${card1RotX}deg)`, opacity: card1P }}>
        <div style={cardShell(true)}>
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: BRAND.red,
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              padding: "6px 14px",
              borderRadius: 8,
              letterSpacing: 2.5,
              zIndex: 2,
              textTransform: "uppercase",
            }}
          >
            Top Pick
          </div>

          <div style={{ width: "100%", height: IMG_H, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile("KingsburyAve.avif")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, width: "100%", height: 60, background: `linear-gradient(transparent, ${theme.card})` }} />
          </div>

          <div style={{ padding: "20px 32px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: theme.text }}>Kingsbury Ave</div>
                <div style={{ fontSize: 17, color: theme.sub, marginTop: 3 }}>Manor Real Estate · 3 bed</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.red }}>~$733/pp</div>
            </div>

            {/* Walk times */}
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              {[{ loc: "Brookings", t: "10 min", at: 38 }, { loc: "The Loop", t: "10 min", at: 44 }].map((w) => {
                const wp = spring({ frame: Math.max(0, frame - w.at), fps: 30, config: { damping: 14, stiffness: 100 } });
                return (
                  <div
                    key={w.loc}
                    style={{
                      opacity: wp,
                      transform: `scale(${interpolate(wp, [0, 1], [0.85, 1])})`,
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
                    <span style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>{w.t}</span>
                    <span style={{ fontSize: 16, color: theme.sub }}>to {w.loc}</span>
                  </div>
                );
              })}
            </div>

            {/* Review */}
            <div
              style={{
                opacity: reviewP,
                transform: `translateY(${interpolate(reviewP, [0, 1], [15, 0])}px)`,
                marginTop: 18,
                background: theme.reviewBg,
                borderRadius: 14,
                padding: "16px 20px",
                border: `1px solid ${theme.cardBorder}`,
              }}
            >
              <div style={{ fontSize: 14, color: "#F5A623", marginBottom: 5, letterSpacing: 2 }}>★★★★★</div>
              <div style={{ fontSize: 17, color: theme.text, fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;Apartment is nice and spacious. I like the in unit washer and dryer.&rdquo;
              </div>
              <div style={{ fontSize: 15, color: theme.sub, marginTop: 6, fontWeight: 600 }}>Sophie K</div>
            </div>

            {/* Scan button */}
            <div
              style={{
                opacity: scanP,
                transform: `scale(${interpolate(scanP, [0, 1], [0.9, 1])})`,
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px 0",
                borderRadius: 12,
                border: `1.5px solid ${BRAND.red}40`,
                color: BRAND.red,
                fontWeight: 700,
                fontSize: 17,
                background: `${BRAND.red}08`,
              }}
            >
              Scan lease for hidden fees
            </div>
          </div>
        </div>
      </div>

      {/* ALTERNATE — same width, same image height, same structure */}
      <div style={{ transform: `translateY(${card2Y}px) rotateX(${card2RotX}deg)`, opacity: card2P }}>
        <div style={cardShell(false)}>
          <div style={{ width: "100%", height: IMG_H, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile("RoseburyAve.avif")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: 0, width: "100%", height: 60, background: `linear-gradient(transparent, ${theme.card})` }} />
          </div>
          <div style={{ padding: "20px 32px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: theme.text }}>Rosebury Rentals</div>
                <div style={{ fontSize: 17, color: theme.sub, marginTop: 3 }}>6219 Rosebury Ave · 3 bed</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: BRAND.red }}>$2,395/mo</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {(() => {
                const wp = spring({ frame: Math.max(0, frame - 48), fps: 30, config: { damping: 14, stiffness: 100 } });
                return (
                  <div
                    style={{
                      opacity: wp,
                      transform: `scale(${interpolate(wp, [0, 1], [0.85, 1])})`,
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
                    <span style={{ fontSize: 17, fontWeight: 700, color: theme.text }}>21 min</span>
                    <span style={{ fontSize: 16, color: theme.sub }}>to campus</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Audio */}
      <Sequence from={0} durationInFrames={18}>
        <Audio src={reveal()} volume={0.3} />
      </Sequence>
      <Sequence from={14} durationInFrames={18}>
        <Audio src={ding()} volume={0.2} />
      </Sequence>
      <Sequence from={75} durationInFrames={8}>
        <Audio src={pop()} volume={0.15} />
      </Sequence>
    </div>
  );
};
