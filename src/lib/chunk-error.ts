const CHUNK_LOAD_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i;

// Set once we've auto-reloaded for a chunk error, so a repeat failure
// (e.g. still offline) shows the fallback UI instead of reload-looping.
const RELOAD_FLAG_KEY = "chunk-load-error-reload";

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return CHUNK_LOAD_ERROR_PATTERN.test(message);
}

// A fresh deploy can invalidate the chunk hashes referenced by the
// already-loaded HTML. Reload once to pick up the new build; if we're
// offline the reload will fail immediately and we fall back to the UI.
// Returns true if a reload was triggered.
export function reloadOnceForChunkError(): boolean {
  if (navigator.onLine && sessionStorage.getItem(RELOAD_FLAG_KEY) !== "1") {
    sessionStorage.setItem(RELOAD_FLAG_KEY, "1");
    window.location.reload();
    return true;
  }
  return false;
}

export function clearChunkErrorReloadFlag() {
  sessionStorage.removeItem(RELOAD_FLAG_KEY);
}
