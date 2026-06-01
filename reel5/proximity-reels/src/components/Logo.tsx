import { Img, staticFile } from "remotion";

export const Logo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <Img
    src={staticFile("logo.svg")}
    style={{ width: size, height: size }}
  />
);
