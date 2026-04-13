import "./index.css";
import { Composition } from "remotion";
import { AosDemo, AOS_DEMO_DURATION } from "./AosDemo";
import { StackedPlanes } from "./StackedPlanes";
import { AosDemoProd, TOTAL_FRAMES } from "./aos-demo";
import { AvatarDemo, AVATAR_FRAMES } from "./AvatarDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="aos-movie"
        component={AvatarDemo}
        defaultProps={{ showAvatar: false }}
        durationInFrames={AVATAR_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
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
    </>
  );
};
