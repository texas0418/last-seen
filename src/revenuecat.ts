// src/revenuecat.ts
// RevenueCat config for Last Seen.
//
// IOS_KEY is the PUBLIC app-specific SDK key. RevenueCat designs these to ship
// inside the app binary — it can read offerings and start a purchase, nothing
// more. It is not a secret. Never put a RevenueCat SECRET key here.
//
// Android is still a placeholder. proAccess.ts fails OPEN for any placeholder
// key, so the story stays unlocked on platforms we have not wired up.

import { Platform } from 'react-native';

export const ENTITLEMENT_ID = 'story';
export const PRODUCT_ID = 'ls_story_unlock';

const IOS_KEY = 'appl_iMnyuNtZnaUQghZUWUpfMqtZTSr';
const ANDROID_KEY = 'REVENUECAT_ANDROID_KEY_PLACEHOLDER';

export const keyForPlatform = (): string =>
  Platform.OS === 'android' ? ANDROID_KEY : IOS_KEY;

export const isPlaceholderKey = (key: string): boolean =>
  key.includes('PLACEHOLDER');
