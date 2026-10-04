import { LazyVideo } from '../../components/LazyVideo';
import { ASSETS } from './shared';

export function Perspective() {
  return (
    <>
      <section aria-label="Perspectives" className="relative overflow-hidden">
        <div className="relative h-[clamp(300px,46vh,500px)]">
          <LazyVideo
            className="mask-fade-y absolute inset-0 size-full object-cover"
            src={`${ASSETS}/video/glass-spheres-loop.mp4`}
            poster={`${ASSETS}/img/glass-study.webp`}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(65% 75% at 50% 50%, rgba(228,222,211,0.55), rgba(228,222,211,0) 72%)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow">PERSPECTIVE</p>
            <h2 className="t-h2 mt-3 font-display font-semibold tracking-tight text-ink">
              One decision. <em>Many angles.</em>
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
