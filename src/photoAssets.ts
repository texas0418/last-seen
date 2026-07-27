// src/photoAssets.ts
// Real photo art, keyed by content photo id. This is the ONLY module that
// require()s image files, so the pure content modules stay Node-testable.
// A photo id with no entry here falls back to its described-scene card, and
// the content `alt`/`closer` strings become the accessibility layer.

export interface PhotoArt {
  image: number;
  /** master aspect ratio (w/h), for layout before the bitmap decodes */
  ar: number;
}

export const PHOTO_ART: Record<string, PhotoArt> = {
  'ph-wallpaper': {
    image: require('../assets/photos/ph-wallpaper.jpg'),
    ar: 941 / 1672,
  },
  'ph-ozzy': {
    image: require('../assets/photos/ph-ozzy.jpg'),
    ar: 1086 / 1448,
  },
  'ph-chart': {
    image: require('../assets/photos/ph-chart.jpg'),
    ar: 1086 / 1448,
  },
  'ph-flyer': {
    image: require('../assets/photos/ph-flyer.jpg'),
    ar: 1086 / 1448,
  },
  'ph-ferry': {
    image: require('../assets/photos/ph-ferry.jpg'),
    ar: 1672 / 941,
  },
  'ph-overlook': {
    image: require('../assets/photos/ph-overlook.jpg'),
    ar: 1086 / 1448,
  },
};
