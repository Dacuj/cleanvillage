import { useEffect, useRef, useState } from 'react';

// Scroll-reveal wrapper: fades + slides content in the first time it enters
// the viewport. Pure CSS transition (see .cv-reveal in tokens.css) so it
// respects prefers-reduced-motion automatically.
//
//   <Reveal delay={120}> ... </Reveal>
export function Reveal({ children, delay = 0, as: Tag = 'div', style, className = '', ...rest }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVis(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`cv-reveal${vis ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
