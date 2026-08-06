"use client";

// Thin re-export of qrcode.react's two render targets — SVG for plain
// display (optionally with an embedded logo via `imageSettings`), Canvas
// for consumers that need to `drawImage()` the QR into a composited export
// (e.g. a shareable PNG). No app-specific logic lives here; consumers build
// their own branded card/caption UI on top.
export { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
