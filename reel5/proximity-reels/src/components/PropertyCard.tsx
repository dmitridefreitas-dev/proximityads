import { interpolate, useCurrentFrame, Img, staticFile } from "remotion";
import { BRAND, type Theme } from "../brand";

interface PropertyCardProps {
  theme: Theme;
  isTopPick: boolean;
  name: string;
  address: string;
  price: string;
  beds: string;
  walkTime: string;
  review?: { author: string; stars: number; text: string };
  image?: string;
  enterFrame: number;
  slideFrom: "left" | "right" | "bottom";
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  theme,
  isTopPick,
  name,
  address,
  price,
  beds,
  walkTime,
  review,
  image,
  enterFrame,
  slideFrom,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - enterFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateX =
    slideFrom === "left"
      ? interpolate(progress, [0, 1], [-800, 0])
      : slideFrom === "right"
        ? interpolate(progress, [0, 1], [800, 0])
        : 0;
  const translateY = slideFrom === "bottom" ? interpolate(progress, [0, 1], [500, 0]) : 0;

  const stars = review ? "★".repeat(review.stars) : "";

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity: progress,
        background: theme.card,
        borderRadius: 28,
        border: `1.5px solid ${isTopPick ? `${BRAND.red}60` : theme.cardBorder}`,
        width: 880,
        overflow: "hidden",
        boxShadow: isTopPick
          ? `0 16px 60px ${BRAND.red}20, 0 0 0 1px ${BRAND.red}15`
          : `0 8px 40px rgba(0,0,0,0.2), 0 0 0 1px ${theme.cardBorder}`,
        position: "relative",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {isTopPick && (
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
            zIndex: 2,
            textTransform: "uppercase",
          }}
        >
          Top Pick
        </div>
      )}

      <div style={{ width: "100%", height: 260, overflow: "hidden", position: "relative" }}>
        {image ? (
          <Img
            src={staticFile(image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: theme.fieldBg }} />
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 80,
            background: `linear-gradient(transparent, ${theme.card})`,
          }}
        />
      </div>

      <div style={{ padding: "22px 32px 28px" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
          {name}
        </div>
        <div style={{ fontSize: 18, color: theme.sub, marginBottom: 16 }}>{address}</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: BRAND.red }}>{price}</div>
          <div style={{ fontSize: 18, color: theme.sub, fontWeight: 500 }}>{beds}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: review ? 18 : 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: BRAND.red,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 600, color: theme.text }}>
            {walkTime} walk to campus
          </span>
        </div>

        {review && (
          <div
            style={{
              background: theme.reviewBg,
              borderRadius: 16,
              padding: "18px 22px",
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            <div style={{ fontSize: 16, color: "#F5A623", marginBottom: 6, letterSpacing: 2 }}>
              {stars}
            </div>
            <div style={{ fontSize: 18, color: theme.text, lineHeight: 1.55, fontStyle: "italic" }}>
              &ldquo;{review.text}&rdquo;
            </div>
            <div style={{ fontSize: 16, color: theme.sub, marginTop: 8, fontWeight: 600 }}>
              {review.author}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
