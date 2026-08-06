"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { FileOpener } from "@capacitor-community/file-opener";

const APK_CONTENT_TYPE = "application/vnd.android.package-archive";
const DEFAULT_DISMISS_KEY = "hexatech.updateDismissedVersionCode";

export type AppUpdateState = "idle" | "available" | "downloading" | "error";

export interface UseAppUpdateCheckOptions {
  /** Endpoint returning `{ data: { versionCode, version? } }`. */
  checkUrl: string;
  /** Endpoint that redirects to (or serves) the APK. */
  downloadUrl: string;
  /** Local filename the APK is downloaded to. */
  apkFileName?: string;
  /** localStorage key used to remember a dismissed versionCode. */
  dismissKey?: string;
}

export interface UseAppUpdateCheckResult {
  state: AppUpdateState;
  /** 0-100, meaningful only while `state === "downloading"`. */
  progress: number;
  versionName?: string;
  /** Downloads the APK and hands it to the native installer. */
  startUpdate: () => void;
  /** Hides the banner and remembers this versionCode so it won't reappear. */
  dismiss: () => void;
}

/**
 * Native-only "update available" check — on a native platform, compares the
 * installed build's version code against a `checkUrl` response, then exposes
 * a small state machine for a non-blocking nudge UI to render against (see
 * `UpdateBanner`). Never throws / never blocks app usage: a failed or
 * offline check silently leaves `state` at `"idle"`.
 */
export function useAppUpdateCheck({
  checkUrl,
  downloadUrl,
  apkFileName = "app-update.apk",
  dismissKey = DEFAULT_DISMISS_KEY,
}: UseAppUpdateCheckOptions): UseAppUpdateCheckResult {
  const [state, setState] = useState<AppUpdateState>("idle");
  const [progress, setProgress] = useState(0);
  const [versionName, setVersionName] = useState<string | undefined>();
  const latestVersionCodeRef = useRef<number | undefined>(undefined);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      const info = await CapacitorApp.getInfo();
      const installed = parseInt(info.build, 10);
      if (!Number.isFinite(installed)) return;

      const res = await fetch(checkUrl);
      const body = (await res.json()) as {
        data?: { versionCode?: number; version?: string };
      };
      const latest = body.data?.versionCode;
      if (latest == null || latest <= installed) return;

      const dismissedRaw = localStorage.getItem(dismissKey);
      const dismissed = dismissedRaw ? parseInt(dismissedRaw, 10) : undefined;
      if (dismissed === latest) return;

      latestVersionCodeRef.current = latest;
      setVersionName(body.data?.version);
      setState("available");
    })().catch(() => {
      // Never block app usage on a failed/offline version check.
    });
  }, [checkUrl, dismissKey]);

  const startUpdate = useCallback(() => {
    if (stateRef.current === "downloading") return;
    setState("downloading");
    setProgress(0);

    (async () => {
      const listener = await Filesystem.addListener("progress", (status) => {
        if (status.contentLength > 0) {
          setProgress(Math.round((status.bytes / status.contentLength) * 100));
        }
      });

      try {
        const { path } = await Filesystem.downloadFile({
          url: downloadUrl,
          path: apkFileName,
          directory: Directory.Cache,
          progress: true,
        });
        if (!path) throw new Error("Download did not return a file path");

        await FileOpener.open({ filePath: path, contentType: APK_CONTENT_TYPE });
        setState("idle");
      } catch {
        setState("error");
      } finally {
        await listener.remove();
      }
    })();
  }, [downloadUrl, apkFileName]);

  const dismiss = useCallback(() => {
    if (stateRef.current === "downloading") return;
    if (latestVersionCodeRef.current != null) {
      localStorage.setItem(dismissKey, String(latestVersionCodeRef.current));
    }
    setState("idle");
  }, [dismissKey]);

  return { state, progress, versionName, startUpdate, dismiss };
}
