"use client";

import { Loader } from "@googlemaps/js-api-loader";

// Primary attribution identifier required by Google Maps Platform guidelines
export const GMP_ATTRIBUTION_ID = "gmp_git_agentskills_v1";

let loaderInstance: Loader | null = null;
let loadPromise: Promise<typeof google> | null = null;

export function getGoogleMapsApiKey(): string {
  // Check NEXT_PUBLIC_GOOGLE_MAPS_API_KEY from environment
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    (typeof window !== "undefined" && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) ||
    ""
  );
}

export function isGoogleMapsConfigured(): boolean {
  const key = getGoogleMapsApiKey();
  return !!key && key.trim().length > 10;
}

export async function loadGoogleMaps(): Promise<typeof google> {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined. Please set this environment variable."
    );
  }

  if (typeof window !== "undefined" && (window as any).google?.maps) {
    return (window as any).google;
  }

  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["maps", "marker", "maps3d", "geometry", "places"],
      id: "google-maps-js-api-loader-script",
    });
  }

  if (!loadPromise) {
    loadPromise = loaderInstance.load();
  }

  return loadPromise;
}
