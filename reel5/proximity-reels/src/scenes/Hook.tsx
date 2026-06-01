import { useCurrentFrame, interpolate, spring, Audio, Sequence } from "remotion";
import { BRAND, type Theme } from "../brand";
import { PropertyCard } from "../components/PropertyCard";
import { whoosh, thud } from "../sounds";

export const Hook: React.FC<{ theme: Theme }> = ({ theme }) => {
  const frame = useCurrentFrame();

  const card1P = spring({ frame, fps: 30, config: { damping: 12, stiffness: 65, mass: 1.2 } });
  const card2P = spring({ frame: Math.max(0, frame - 6), fps: 30, config: { damping: 12, stiffness: 65, mass: 1.2 } });

  const card1X = interpolate(card1P, [0, 1], [-1100, 0]);
  const card2X = interpolate(card2P, [0, 1], [1100, 0]);
  const card1Rotate = interpolate(card1P, [0, 1], [-10, -3.5]);
  const card2Rotate = interpolate(card2P, [0, 1], [10, 3]);
  const card1Z = interpolate(card1P, [0, 0.5, 1], [0, 40, 0]);
  const card2Z = interpolate(card2P, [0, 0.5, 1], [0, -30, -20]);

  const textP = spring({ frame: Math.max(0, frame - 38), fps: 30, config: { damping: 10, stiffness: 45, mass: 1.1 } });
  const textY = interpolate(textP, [0, 1], [80, 0]);

  const exitP = interpolate(frame, [112, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(exitP, [0, 1], [1, 0.85]);

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
        perspective: 1800,
        overflow: "hidden",
      }}
    >
      {/* Red ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${BRAND.red}10 0%, transparent 65%)`,
          top: "28%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          opacity: 1 - exitP,
          transform: `scale(${exitScale})`,
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 940,
            height: 840,
            marginBottom: 50,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 30,
              transform: `translateX(${card2X}px) rotate(${card2Rotate}deg) translateZ(${card2Z}px)`,
            }}
          >
            <PropertyCard
              theme={theme}
              isTopPick={false}
              name="Rosebury Rentals"
              address="6219 Rosebury Ave"
              price="$2,395/mo"
              beds="3 bed · 2 bath"
              walkTime="21 min"
              image="RoseburyAve.avif"
              review={{
                author: "Steven C",
                stars: 5,
                text: "Great property. I like having in unit laundry machines.",
              }}
              enterFrame={0}
              slideFrom="right"
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateX(${card1X}px) rotate(${card1Rotate}deg) translateZ(${card1Z}px)`,
              zIndex: 2,
            }}
          >
            <PropertyCard
              theme={theme}
              isTopPick={true}
              name="Kingsbury Ave"
              address="Manor Real Estate"
              price="~$733/person"
              beds="3 bed"
              walkTime="10 min"
              image="KingsburyAve.avif"
              review={{
                author: "Sophie K",
                stars: 5,
                text: "Apartment is nice and spacious. I like the in unit washer and dryer.",
              }}
              enterFrame={0}
              slideFrom="left"
            />
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${textY}px)`,
            opacity: textP,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 68, fontWeight: 800, color: theme.text, lineHeight: 1.15, letterSpacing: -1 }}>
            Meet your WashU
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: BRAND.red,
              lineHeight: 1.15,
              letterSpacing: -1,
              textShadow: `0 4px 40px ${BRAND.red}25`,
            }}
          >
            housing agent.
          </div>
        </div>
      </div>

      <Sequence from={0} durationInFrames={15}>
        <Audio src={whoosh()} volume={0.35} />
      </Sequence>
      <Sequence from={6} durationInFrames={15}>
        <Audio src={whoosh()} volume={0.25} />
      </Sequence>
      <Sequence from={20} durationInFrames={10}>
        <Audio src={thud()} volume={0.25} />
      </Sequence>
    </div>
  );
};
