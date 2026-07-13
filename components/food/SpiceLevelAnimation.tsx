'use client';

import { useEffect, useRef, useState } from 'react';

const animationClassName = (isVisible: boolean) =>
  `block h-auto max-h-[620px] w-full max-w-[920px] select-none object-contain object-center transition-[opacity,transform,visibility] duration-[400ms] ease-out motion-reduce:transform-none motion-reduce:transition-opacity motion-reduce:duration-150 ${
    isVisible
      ? 'visible translate-y-0 scale-100 opacity-100'
      : 'invisible translate-y-2 scale-[0.985] opacity-0'
  }`;

export default function SpiceLevelAnimation() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [useImageFallback, setUseImageFallback] = useState(false);

  useEffect(() => {
    if (!isAnimationReady) return;

    const revealTimer = window.setTimeout(() => {
      setIsVisible(true);
      videoRef.current?.play().catch(() => setUseImageFallback(true));
    }, 1000);

    return () => window.clearTimeout(revealTimer);
  }, [isAnimationReady]);

  if (useImageFallback) {
    return (
      <img
        src="/videos/our-food/flavours-animation.webp?v=5"
        alt="Maeme’s Piri Piri flavour and spice levels"
        draggable={false}
        onLoad={() => setIsAnimationReady(true)}
        onError={(event) => {
          console.error('Hero animation fallback failed to load', {
            currentSrc: event.currentTarget.currentSrc,
          });
        }}
        className={animationClassName(isVisible)}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Maeme’s Piri Piri flavour and spice levels"
      onCanPlay={() => setIsAnimationReady(true)}
      onLoadedData={() => setIsAnimationReady(true)}
      onError={() => {
        setIsVisible(false);
        setIsAnimationReady(false);
        setUseImageFallback(true);
      }}
      className={animationClassName(isVisible)}
    >
      <source src="/videos/our-food/flavours-animation.webm?v=5" type="video/webm" />
      Your browser does not support this video.
    </video>
  );
}
