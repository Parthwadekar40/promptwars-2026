import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Decorative loop that loads and plays only once it nears the viewport; reduced-motion visitors keep the poster. */
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return <video ref={ref} className={className} src={near ? src : undefined} poster={poster} autoPlay={near} muted loop playsInline aria-hidden />;
}
