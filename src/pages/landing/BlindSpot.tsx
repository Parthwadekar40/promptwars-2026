import { Atmosphere } from '../../components/Atmosphere';
import { Reveal } from '../../components/Reveal';
import { Spotlight } from '../../components/Spotlight';
import { ASSETS } from './shared';

export function BlindSpot() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#0b0a10]">
        <Atmosphere dark />
        <div className="mx-auto max-w-4xl px-6 pt-28 text-center md:pt-36">
          <p className="eyebrow !text-white/60">The blind spot</p>
          <Reveal>
            <h2 className="t-quote mt-6 font-serif font-normal italic leading-snug text-white">
              “We rarely decide in the dark. We decide in a small circle of light — and mistake it for the whole room.”
            </h2>
          </Reveal>
          <p className="mt-6 text-white/65">Move through the dark. Everything here was always in the room.</p>
        </div>
        <div className="relative mt-2">
          <img
            src={`${ASSETS}/img/periphery.webp`}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            width="1440"
            height="611"
            className="block min-h-[440px] w-full object-cover"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0, #000 26%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 26%)',
            }}
          />
          <Spotlight className="absolute inset-x-0 top-0 h-[50%] md:h-[60%]" />
        </div>
        <p className="sr-only">
          Thoughts that sit just outside attention: an assumption, sunk cost, who is missing, second-order effects, the deadline,
          reversibility, the other side, anchoring.
        </p>
      </section>
    </>
  );
}
