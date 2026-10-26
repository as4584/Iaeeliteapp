import { Asset } from 'expo-asset';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

// Web preview: expo-video's web VideoView keeps the <video> at its intrinsic size instead of
// filling the frame, so render a plain full-bleed <video> with object-fit: cover.
export function FilmLayer({ source }: { source: number | string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const uri = typeof source === 'string' ? source : Asset.fromModule(source).uri;

  useFocusEffect(
    useCallback(() => {
      ref.current?.play().catch(() => undefined);
      return () => ref.current?.pause();
    }, []),
  );

  return (
    <video
      ref={ref}
      src={uri}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
