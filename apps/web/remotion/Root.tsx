import React from "react";
import { Composition } from "remotion";
import { PrintingIntro } from "./compositions/PrintingIntro";
import { CMYKSequence } from "./compositions/CMYKSequence";
import { ProductReveal } from "./compositions/ProductReveal";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PrintingIntro"
        component={PrintingIntro}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="CMYKSequence"
        component={CMYKSequence}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ProductReveal"
        component={ProductReveal}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
