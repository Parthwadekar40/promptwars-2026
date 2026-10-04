import { Badge } from '../../components/ui';
import { Reveal } from '../../components/Reveal';
import { ASSETS } from './shared';

export function MirrorSection() {
  return (
    <>
      <section id="mirror" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[0.75fr_1.25fr] md:py-28">
          <Reveal>
            <img
              src={`${ASSETS}/img/mirror.webp`}
              alt="A tall mirror reflecting a brighter version of the same room"
              loading="lazy"
              decoding="async"
              width="540"
              height="820"
              className="mx-auto w-full max-w-[380px]"
            />
          </Reveal>
          <div>
            <Badge>Examine your reasoning</Badge>
            <h2 className="t-h2 mt-5 max-w-xl font-display font-semibold tracking-tight text-ink">
              Hold your thinking up to <em className="text-ink-muted">a&nbsp;mirror.</em>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-muted">
              Answer the questions in your own words and Penumbra reflects them back — quoting you, noticing where one
              answer pulls against another, naming what is still unexamined. It never tells you which side is right.
            </p>
            <ul className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
              {[
                { t: 'Your words, quoted', b: 'Built from what you actually wrote.' },
                { t: 'Tensions, named', b: 'Where two of your answers pull apart.' },
                { t: 'Nothing decided', b: 'It ends with a question, never a verdict.' },
              ].map((x) => (
                <li key={x.t} className="bg-paper p-5">
                  <p className="font-display font-semibold tracking-tight text-ink">{x.t}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{x.b}</p>
                </li>
              ))}
            </ul>
            <a
              href="#/think?sample"
              className="mt-7 inline-block text-[15px] font-medium text-brand-700 underline underline-offset-4"
            >
              See a reflection in the sample →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
