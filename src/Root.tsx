import "./index.css";
import { Composition } from "remotion";
import { AosDemo, AOS_FRAMES } from "./AosDemo";
import { StackedPlanes } from "./StackedPlanes";
import { DemoV3, DEMO_V3_FRAMES } from "./DemoV3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="aos-demo"
        component={AosDemo}
        defaultProps={{ showAvatar: false }}
        durationInFrames={AOS_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="StackedPlanes"
        component={StackedPlanes}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="demov3"
        component={DemoV3}
        durationInFrames={DEMO_V3_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
