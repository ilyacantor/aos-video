import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { AosDemo, AOS_DEMO_DURATION } from "./AosDemo";
import { StackedPlanes } from "./StackedPlanes";
import { DemoScript } from "./DemoScript";
import { AosDemoProd, TOTAL_FRAMES } from "./aos-demo";
import { AosMovie, AOS_MOVIE_FRAMES } from "./DemoV2";
import { DemoV3, DEMO_V3_FRAMES } from "./DemoV3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="aos-movie"
        component={AosMovie}
        durationInFrames={AOS_MOVIE_FRAMES}
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
