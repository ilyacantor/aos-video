import { AbsoluteFill, Sequence } from "remotion";
import { C, FONT, BEATS, TOTAL_FRAMES } from "./shared";
import { Beat1Stakes } from "./Beat1Stakes";
import { Beat2Engine } from "./Beat2Engine";
import { Beat3Peak } from "./Beat3Peak";
import { Beat4Close } from "./Beat4Close";

export { TOTAL_FRAMES };

/**
 * AOS Demo — Production Build
 * Duration derived from beat durations, not fixed.
 * 1920×1080 30fps
 */
export const AosDemoProd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.dark, fontFamily: FONT }}>
      <Sequence from={BEATS.stakes.start} durationInFrames={BEATS.stakes.dur} premountFor={30}>
        <Beat1Stakes />
      </Sequence>

      <Sequence from={BEATS.engine.start} durationInFrames={BEATS.engine.dur} premountFor={30}>
        <Beat2Engine />
      </Sequence>

      <Sequence from={BEATS.peak.start} durationInFrames={BEATS.peak.dur} premountFor={30}>
        <Beat3Peak />
      </Sequence>

      <Sequence from={BEATS.close.start} durationInFrames={BEATS.close.dur} premountFor={30}>
        <Beat4Close />
      </Sequence>
    </AbsoluteFill>
  );
};
