// src/revenuecat.ts
// RevenueCat config for Last Seen.
//
// IOS_KEY is the PUBLIC app-specific SDK key. RevenueCat designs these to ship
// inside the app binary — it can read offerings and start a purchase, nothing
// more. It is not a secret. Never put a RevenueCat SECRET key here.
//
// Store selection is a BUILD-TIME flag: EXPO_PUBLIC_STORE=amazon in the
// environment when Metro bundles (scripts/build-amazon-apk.sh sets it). Unset,
// every Android build is a Play build. proAccess.ts fails OPEN for any
// placeholder key, so AMAZON_KEY must be the real amzn_ key before an Amazon
// build ships; scripts/build-amazon-apk.sh refuses to build while it is not.

import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'story';
export const PRODUCT_ID = 'ls_full_story';

const IOS_KEY = 'appl_zokzbmbAsXOeidlUQpxEKJAMkBZ';
const ANDROID_KEY = 'goog_syYLSvCSFvQdQrqyLMIecVObgNL';
const AMAZON_KEY = 'amzn_PLACEHOLDER';

export const IS_AMAZON_BUILD = process.env.EXPO_PUBLIC_STORE === 'amazon';

export const keyForPlatform = (): string => {
  if (Platform.OS !== 'android') return IOS_KEY;
  return IS_AMAZON_BUILD ? AMAZON_KEY : ANDROID_KEY;
};

export const isPlaceholderKey = (key: string): boolean =>
  key.includes('PLACEHOLDER');
