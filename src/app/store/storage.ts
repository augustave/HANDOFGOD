// localStorage adapter that never throws (Safari private mode, quota, jsdom
// edge cases) — falls back to an in-memory map so the app works statelessly.

import type { StateStorage } from "zustand/middleware";

export const STORAGE_KEY = "hand_of_god:dossier:v1";
export const STORAGE_VERSION = 1;

const memoryFallback = new Map<string, string>();

function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage !== undefined;
  } catch {
    return false;
  }
}

export const safeLocalStorage: StateStorage = {
  getItem(name: string): string | null {
    if (hasLocalStorage()) {
      try {
        return window.localStorage.getItem(name);
      } catch {
        return memoryFallback.get(name) ?? null;
      }
    }
    return memoryFallback.get(name) ?? null;
  },
  setItem(name: string, value: string): void {
    if (hasLocalStorage()) {
      try {
        window.localStorage.setItem(name, value);
        return;
      } catch {
        // fall through to memory
      }
    }
    memoryFallback.set(name, value);
  },
  removeItem(name: string): void {
    if (hasLocalStorage()) {
      try {
        window.localStorage.removeItem(name);
      } catch {
        // fall through to memory
      }
    }
    memoryFallback.delete(name);
  },
};

export function createSessionId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID().slice(0, 8).toUpperCase();
    }
  } catch {
    // fall through
  }
  return Math.random().toString(16).slice(2, 10).toUpperCase();
}
