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
  'ph-tcar': {
    image: require('../assets/photos/ph-tcar.jpg'),
    ar: 1211 / 653,
  },
  'b1': {
    image: require('../assets/photos/b1.jpg'),
    ar: 1211 / 653,
  },
  'b2': {
    image: require('../assets/photos/b2.jpg'),
    ar: 1211 / 653,
  },
  'b3': {
    image: require('../assets/photos/b3.jpg'),
    ar: 1211 / 653,
  },
  'b4': {
    image: require('../assets/photos/b4.jpg'),
    ar: 1211 / 653,
  },
  'b5': {
    image: require('../assets/photos/b5.jpg'),
    ar: 1211 / 653,
  },
  'b6': {
    image: require('../assets/photos/b6.jpg'),
    ar: 1211 / 653,
  },
  'b7': {
    image: require('../assets/photos/b7.jpg'),
    ar: 1211 / 653,
  },
  'b8': {
    image: require('../assets/photos/b8.jpg'),
    ar: 1211 / 653,
  },
  'b9': {
    image: require('../assets/photos/b9.jpg'),
    ar: 1211 / 653,
  },
  'b10': {
    image: require('../assets/photos/b10.jpg'),
    ar: 1211 / 653,
  },
  'b11': {
    image: require('../assets/photos/b11.jpg'),
    ar: 799 / 653,
  },
  'b12': {
    image: require('../assets/photos/b12.jpg'),
    ar: 1211 / 653,
  },
  'b13': {
    image: require('../assets/photos/b13.jpg'),
    ar: 1211 / 653,
  },
};
