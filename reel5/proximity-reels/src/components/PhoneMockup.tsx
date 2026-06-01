import { type Theme } from "../brand";

export const PhoneMockup: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <div
    style={{
      width: 780,
      height: 1400,
      borderRadius: 64,
      border: `5px solid ${theme.cardBorder}`,
      background: theme.card,
      overflow: "hidden",
      position: "relative",
      boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
    }}
  >
    {/* Notch */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 240,
        height: 44,
        background: theme.bg === "#0D0D0D" ? "#000" : "#1a1a1a",
        borderRadius: "0 0 24px 24px",
        zIndex: 10,
      }}
    />
    <div
      style={{
        padding: "68px 40px 40px",
        height: "100%",
        overflowY: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);
