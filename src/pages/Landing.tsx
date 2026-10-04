import { Begin } from './landing/Begin';
import { BlindSpot } from './landing/BlindSpot';
import { Hero } from './landing/Hero';
import { HowItWorks } from './landing/HowItWorks';
import { MirrorSection } from './landing/MirrorSection';
import { OneRule } from './landing/OneRule';
import { Perspective } from './landing/Perspective';

/** Landing — the problem, the one rule, and the way in. */
export function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <MirrorSection />
      <Perspective />
      <BlindSpot />
      <OneRule />
      <Begin />
    </>
  );
}
