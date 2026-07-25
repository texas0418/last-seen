// src/proAccess.ts
// Fail-open story gate for Last Seen. The one product: continuing past the
// personal-mail unlock (Act 1 is free forever — the lock screen, the texts,
// the voicemails, and the first password are the demo AND the hook).
//
// HOUSE RULE: if react-native-purchases is not in the running build (Expo Go,
// or a build without the native module) OR the RevenueCat key is still a
// placeholder, the story is UNLOCKED. Never hide a chapter behind a wall the
// player cannot pay through.

import { useSyncExternalStore } from 'react';

import { ENTITLEMENT_ID, isPlaceholderKey, keyForPlatform } from './revenuecat';

let unlocked = false;
let initialized = false;
const listeners = new Set<() => void>();

function setUnlocked(next: boolean): void {
  if (next === unlocked) return;
  unlocked = next;
  listeners.forEach((l) => l());
}

// Lazy, guarded access to the native SDK. Returns null when it isn't in this build.
function getPurchases(): any | null {
  try {
    // require (not a static import) so a missing native module can't crash module load.
    const mod = require('react-native-purchases');
    return mod?.default ?? mod ?? null;
  } catch {
    return null;
  }
}

export function initPurchases(): void {
  if (initialized) return;
  initialized = true;
  const key = keyForPlatform();
  const Purchases = getPurchases();
  if (!Purchases || isPlaceholderKey(key)) {
    setUnlocked(true);
    return;
  }
  try {
    Purchases.configure({ apiKey: key });
    Purchases.addCustomerInfoUpdateListener((info: any) => {
      setUnlocked(Boolean(info?.entitlements?.active?.[ENTITLEMENT_ID]));
    });
    Purchases.getCustomerInfo()
      .then((info: any) =>
        setUnlocked(Boolean(info?.entitlements?.active?.[ENTITLEMENT_ID])),
      )
      .catch(() => setUnlocked(true));
  } catch {
    setUnlocked(true);
  }
}

export async function purchaseStory(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || isPlaceholderKey(keyForPlatform())) {
    setUnlocked(true);
    return true;
  }
  try {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.[0];
    if (!pkg) return unlocked;
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    setUnlocked(Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]));
  } catch {
    // user cancelled or store error — no state change
  }
  return unlocked;
}

export async function restoreStory(): Promise<boolean> {
  const Purchases = getPurchases();
  if (!Purchases || isPlaceholderKey(keyForPlatform())) {
    setUnlocked(true);
    return true;
  }
  try {
    const info = await Purchases.restorePurchases();
    setUnlocked(Boolean(info?.entitlements?.active?.[ENTITLEMENT_ID]));
  } catch {
    // ignore
  }
  return unlocked;
}

const subscribe = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useStoryUnlocked = (): boolean =>
  useSyncExternalStore(subscribe, () => unlocked);
