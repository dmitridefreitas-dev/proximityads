import { BRAND } from "../brand";

export const Badge: React.FC = () => (
  <div
    style={{
      fontFamily: "Inter, sans-serif",
      fontWeight: 900,
      fontSize: 18,
      letterSpacing: 2,
      color: BRAND.red,
      padding: "8px 16px",
      borderRadius: 6,
      border: `2px solid ${BRAND.red}`,
      background: BRAND.redTint,
    }}
  >
    FOR WASHU STUDENTS
  </div>
);
