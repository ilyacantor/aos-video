import "./index.css";
import { Composition } from "remotion";
import { AosDemo, AOS_DEMO_DURATION } from "./AosDemo";
import { StackedPlanes } from "./StackedPlanes";
import { AosDemoProd, TOTAL_FRAMES } from "./aos-demo";
import { AvatarDemo, AVATAR_FRAMES } from "./AvatarDemo";
import { DemoV3, DEMO_V3_FRAMES } from "./DemoV3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* RETIRED: aos-movie composition (no-avatar variant) was removed
          on 2026-04-14. Ilya only ships the avatar-demo build. Do not
          re-register this composition or add a render script for it. */}
      <Composition
        id="avatar-demo"
        component={AvatarDemo}
        defaultProps={{ showAvatar: true }}
        durationInFrames={AVATAR_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AosDemo"
        component={AosDemo}
        durationInFrames={AOS_DEMO_DURATION}
        fps={30}
        width={1280}
        height={720}
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
        id="AosDemoProd"
        component={AosDemoProd}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
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
