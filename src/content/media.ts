import type { ImageSource } from 'expo-image';

type Img = number | ImageSource;

// Bundled client media (decoded from iaeelite.com). Remote content refers to these as `asset:<key>`.
const images: Record<string, Img> = {
  crest: require('@/assets/media/crest.webp'),
  'crest-small': require('@/assets/media/crest-small.webp'),
  'hero-motorcade': require('@/assets/media/hero-motorcade.jpg'),
  'svc-transport': require('@/assets/media/svc-transport.jpg'),
  'svc-itinerary': require('@/assets/media/svc-itinerary.jpg'),
  'svc-flight': require('@/assets/media/svc-flight.jpg'),
  'svc-venue': require('@/assets/media/svc-venue.jpg'),
  'svc-event': require('@/assets/media/svc-event.jpg'),
  'svc-detail': require('@/assets/media/svc-detail.jpg'),
  'cr-festival': require('@/assets/media/cr-festival.jpg'),
  'cr-live': require('@/assets/media/cr-live.jpg'),
  'cr-fans': require('@/assets/media/cr-fans.jpg'),
  'cr-crowd': require('@/assets/media/cr-crowd.jpg'),
  'cr-everyday': require('@/assets/media/cr-everyday.jpg'),
  'cr-tour': require('@/assets/media/cr-tour.jpg'),
  'sp-video': require('@/assets/media/sp-video.webp'),
  'sp-podcast': require('@/assets/media/sp-podcast.webp'),
  'sp-lounge': require('@/assets/media/sp-lounge.jpg'),
  'sp-meetings': require('@/assets/media/sp-meetings.jpg'),
  'sp-social': require('@/assets/media/sp-social.jpg'),
  'sp-private': require('@/assets/media/sp-private.jpg'),
  'acc-flight': require('@/assets/media/acc-flight.webp'),
  'acc-arrival': require('@/assets/media/acc-arrival.webp'),
  'field-arrival': require('@/assets/media/field-arrival.webp'),
  'field-street': require('@/assets/media/field-street.webp'),
  'field-credential': require('@/assets/media/field-credential.jpg'),
  'field-access': require('@/assets/media/field-access.jpg'),
  'eng-request': require('@/assets/media/eng-request.jpg'),
  'eng-confirm': require('@/assets/media/eng-confirm.jpg'),
  'film-arrival-poster': require('@/assets/media/film-arrival.webp'),
  'film-room-poster': require('@/assets/media/film-room.webp'),
  'film-standard-poster': require('@/assets/media/film-standard.webp'),
};

const videos: Record<string, number> = {
  'film-arrival': require('@/assets/media/film-arrival.mp4'),
  'film-room': require('@/assets/media/film-room.mp4'),
  'film-standard': require('@/assets/media/film-standard.mp4'),
};

const FALLBACK = images.crest;

/** Resolve an ImageRef. Unknown asset keys fall back to the crest instead of rendering nothing. */
export function resolveImage(ref: string): Img {
  if (ref.startsWith('asset:')) return images[ref.slice(6)] ?? FALLBACK;
  return { uri: ref };
}

export function resolveVideo(ref: string): number | string | null {
  if (ref.startsWith('asset:')) return videos[ref.slice(6)] ?? null;
  return ref.startsWith('https://') ? ref : null;
}

export function hasAsset(ref: string): boolean {
  return !ref.startsWith('asset:') || ref.slice(6) in images;
}

export const crest = images.crest;
