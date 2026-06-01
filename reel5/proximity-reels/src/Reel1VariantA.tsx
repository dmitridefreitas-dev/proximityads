import { AbsoluteFill, Sequence, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { getTheme, BRAND } from "./brand";
import { Hook } from "./scenes/Hook";
import { FormFill } from "./scenes/FormFill";
import { MatchResults } from "./scenes/MatchResults";
import { DetailView } from "./scenes/DetailView";
import { ClosingCard } from "./scenes/ClosingCard";

export const Reel1VariantA: React.FC<{ dark: boolean }> = ({ dark }) => {
  const theme = getTheme(dark);
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {/* Persistent logo top-left */}
      <div style={{ position: "absolute", top: 48, left: 44, zIndex: 100, opacity: logoOpacity }}>
        <Img src={staticFile("logo.svg")} style={{ width: 48, height: 48 }} />
      </div>

      {/* Persistent badge top-right */}
      <div
        style={{
          position: "absolute",
          top: 52,
          right: 44,
          zIndex: 100,
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: 2,
          color: BRAND.red,
          padding: "6px 14px",
          borderRadius: 6,
          border: `1.5px solid ${BRAND.red}30`,
          background: theme.glowStrong,
          opacity: logoOpacity,
        }}
      >
        FOR WASHU STUDENTS
      </div>

      <Sequence from={0} durationInFrames={150}>
        <Hook theme={theme} />
      </Sequence>

      <Sequence from={150} durationInFrames={190}>
        <FormFill theme={theme} />
      </Sequence>

      <Sequence from={340} durationInFrames={210}>
        <MatchResults theme={theme} />
      </Sequence>

      <Sequence from={550} durationInFrames={200}>
        <DetailView theme={theme} />
      </Sequence>

      <Sequence from={750} durationInFrames={150}>
        <ClosingCard theme={theme} />
      </Sequence>
    </AbsoluteFill>
  );
};
