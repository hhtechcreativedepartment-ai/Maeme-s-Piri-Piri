'use client';

import { useState } from 'react';

const animationClassName =
  'block h-auto max-h-[620px] w-full max-w-[920px] select-none object-contain object-center';

export default function SpiceLevelAnimation() {
  const [useImageFallback, setUseImageFallback] = useState(false);

  if (useImageFallback) {
    return (
      <img
        src="/videos/our-food/flavours-animation.webp?v=5"
        alt="Maeme’s Piri Piri flavour and spice levels"
        draggable={false}
        onError={(event) => {
          console.error('Hero animation fallback failed to load', {
            currentSrc: event.currentTarget.currentSrc,
          });
        }}
        className={animationClassName}
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Maeme’s Piri Piri flavour and spice levels"
      onError={() => setUseImageFallback(true)}
      className={animationClassName}
    >
      <source src="/videos/our-food/flavours-animation.webm?v=5" type="video/webm" />
      Your browser does not support this video.
    </video>
  );
}
