import { Composition } from "remotion";
import { Reel1VariantA } from "./Reel1VariantA";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel1VariantA"
        component={Reel1VariantA}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ dark: true }}
      />
      <Composition
        id="Reel1VariantALight"
        component={Reel1VariantA}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ dark: false }}
      />
    </>
  );
};
