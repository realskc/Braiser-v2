import type { BraiserApi } from "../preload/preload";

declare global {
  interface Window {
    braiser: BraiserApi;
  }
}

export {};
