/**
 * Sandbox controller.
 *
 * The parent app never evaluates user code. It sends preprocessed source here
 * and this isolated document compiles (Babel) and executes it, reporting
 * diagnostics back over postMessage.
 */
import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import * as Babel from "https://esm.sh/@babel/standalone@7.26.4";
import * as PosterCore from "./runtime.js";

const rootEl = document.getElementById("poster-root");
rootEl.innerHTML = "";
const reactRoot = createRoot(rootEl);

let currentAssets = {};
let currentLogoSlot = null;

function send(message) {
  parent.postMessage({ source: "poster-sandbox", ...message }, "*");
}

function toDiagnostic(error, kind) {
  const message = String(error?.message ?? error);
  const loc = error?.loc;
  const match = /\((\d+):(\d+)\)/.exec(message);
  return {
    severity: "error",
    kind,
    message: message.replace(/^.*?:\s*/, "").split("\n")[0] || message,
    line: loc?.line ?? (match ? Number(match[1]) : undefined),
    column: loc?.column ?? (match ? Number(match[2]) : undefined),
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    send({ type: "runtime-error", diagnostic: toDiagnostic(error, "runtime") });
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

function setSize(width, height) {
  rootEl.style.width = `${width}px`;
  rootEl.style.height = `${height}px`;
}

function compile(code, assets) {
  const output = Babel.transform(code, {
    filename: "poster.tsx",
    presets: [["react", { runtime: "classic" }], "typescript"],
    sourceType: "script",
  });
  const body = `${output.code}\n;return typeof __default !== "undefined" ? __default : (typeof Poster !== "undefined" ? Poster : null);`;
  // eslint-disable-next-line no-new-func -- intentional: sandboxed document only
  const factory = new Function("React", "PosterCore", "assets", body);
  return factory(React, PosterCore, assets);
}

function clearPreview() {
  reactRoot.render(null);
}

function render(payload) {
  setSize(payload.width, payload.height);
  currentAssets = payload.assets && typeof payload.assets === "object" ? payload.assets : {};
  currentLogoSlot = payload.logoSlot ?? null;
  PosterCore.setPosterAssets(currentAssets);

  let Component;
  try {
    Component = compile(payload.code, currentAssets);
  } catch (error) {
    clearPreview();
    send({
      type: "compile-error",
      diagnostic: toDiagnostic(error, "compile"),
    });
    return;
  }
  if (typeof Component !== "function") {
    clearPreview();
    send({
      type: "compile-error",
      diagnostic: {
        severity: "error",
        kind: "compile",
        message: "The default export is not a React component function.",
      },
    });
    return;
  }
  try {
    const overlay =
      currentLogoSlot && currentAssets.logo?.dataUrl
        ? React.createElement(PosterCore.LogoOverlay, {
            slot: currentLogoSlot,
            src: currentAssets.logo.dataUrl,
          })
        : null;
    reactRoot.render(
      React.createElement(
        ErrorBoundary,
        { key: Date.now() },
        React.createElement(
          "div",
          { className: "relative w-full h-full" },
          React.createElement(Component),
          overlay,
        ),
      ),
    );
    send({ type: "rendered" });
  } catch (error) {
    clearPreview();
    send({ type: "runtime-error", diagnostic: toDiagnostic(error, "runtime") });
  }
}

async function loadHtmlToImage() {
  return import("https://esm.sh/html-to-image@1.11.13");
}

/** Keep in sync with src/core/export/exportDefaults.ts */
const DEFAULT_EXPORT_SCALE = 3;
const DEFAULT_PDF_EXPORT_SCALE = 4;
const MAX_EXPORT_SCALE = 6;
const MAX_PDF_EXPORT_SCALE = 5;
const MIN_EXPORT_BYTES = 3 * 1024 * 1024;
const MIN_PDF_EXPORT_BYTES = 3 * 1024 * 1024;
const MAX_PDF_EXPORT_BYTES = 5 * 1024 * 1024;
const LOSSY_EXPORT_QUALITY = 1;
const PDF_EXPORT_QUALITY = 1;

/** Keep in sync with src/core/export/svgDataUrl.ts */
function svgDataUrlToMarkup(dataUrl) {
  const i = dataUrl.indexOf(",");
  if (i < 0) throw new Error("Invalid SVG data URL");
  const header = dataUrl.slice(0, i);
  const payload = dataUrl.slice(i + 1);
  if (/;base64/i.test(header)) return atob(payload);
  try {
    return decodeURIComponent(payload);
  } catch {
    return payload;
  }
}

/** Keep in sync with src/core/export/dataUrlBytes.ts */
function dataUrlByteLength(dataUrl) {
  const i = dataUrl.indexOf(",");
  if (i < 0) return dataUrl.length;
  const header = dataUrl.slice(0, i);
  const payload = dataUrl.slice(i + 1);
  if (/;base64/i.test(header)) {
    const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor((payload.length * 3) / 4) - padding);
  }
  try {
    return decodeURIComponent(payload).length;
  } catch {
    return payload.length;
  }
}

function isRasterExportFormat(format) {
  return format === "png" || format === "jpg" || format === "webp";
}

async function captureExport(lib, format, scale) {
  const options = {
    pixelRatio: scale,
    width: rootEl.offsetWidth,
    height: rootEl.offsetHeight,
    cacheBust: true,
    skipFonts: false,
  };

  if (format === "png") {
    return { data: await lib.toPng(rootEl, options), mimeType: "image/png" };
  }
  if (format === "jpg") {
    return {
      data: await lib.toJpeg(rootEl, {
        ...options,
        quality: LOSSY_EXPORT_QUALITY,
        backgroundColor: "#ffffff",
      }),
      mimeType: "image/jpeg",
    };
  }
  if (format === "webp") {
    const canvas = await lib.toCanvas(rootEl, options);
    return {
      data: canvas.toDataURL("image/webp", LOSSY_EXPORT_QUALITY),
      mimeType: "image/webp",
    };
  }
  if (format === "svg") {
    return {
      data: svgDataUrlToMarkup(await lib.toSvg(rootEl, options)),
      mimeType: "image/svg+xml",
    };
  }
  if (format === "pdf") {
    const jpeg = await lib.toJpeg(rootEl, {
      ...options,
      quality: PDF_EXPORT_QUALITY,
      backgroundColor: "#ffffff",
    });
    const { jsPDF } = await import("https://esm.sh/jspdf@2.5.2");
    const w = rootEl.offsetWidth;
    const h = rootEl.offsetHeight;
    const pdf = new jsPDF({
      orientation: w > h ? "landscape" : "portrait",
      unit: "px",
      format: [w, h],
    });
    pdf.addImage(jpeg, "JPEG", 0, 0, w, h);
    return { data: pdf.output("datauristring"), mimeType: "application/pdf" };
  }
  throw new Error(`Unsupported format: ${format}`);
}

async function runExport(payload) {
  const { format, requestId } = payload;
  let scale =
    payload.scale ?? (format === "pdf" ? DEFAULT_PDF_EXPORT_SCALE : DEFAULT_EXPORT_SCALE);
  try {
    const lib = await loadHtmlToImage();
    let result = await captureExport(lib, format, scale);

    if (isRasterExportFormat(format)) {
      while (
        dataUrlByteLength(result.data) < MIN_EXPORT_BYTES &&
        scale < MAX_EXPORT_SCALE
      ) {
        scale += 1;
        result = await captureExport(lib, format, scale);
      }
    }

    if (format === "pdf") {
      while (
        dataUrlByteLength(result.data) < MIN_PDF_EXPORT_BYTES &&
        scale < MAX_PDF_EXPORT_SCALE
      ) {
        scale += 1;
        result = await captureExport(lib, format, scale);
      }
      while (dataUrlByteLength(result.data) > MAX_PDF_EXPORT_BYTES && scale > 1) {
        scale -= 1;
        result = await captureExport(lib, format, scale);
      }
    }

    send({
      type: "export-done",
      requestId,
      format,
      data: result.data,
      mimeType: result.mimeType,
    });
  } catch (error) {
    send({ type: "export-failed", requestId, message: String(error?.message ?? error) });
  }
}

window.addEventListener("message", (event) => {
  const payload = event.data;
  if (!payload || payload.target !== "poster-sandbox") return;
  if (payload.type === "render") render(payload);
  if (payload.type === "clear") clearPreview();
  if (payload.type === "export") void runExport(payload);
});

window.addEventListener("error", (event) => {
  send({
    type: "runtime-error",
    diagnostic: toDiagnostic(event.error ?? event.message, "runtime"),
  });
});
window.addEventListener("unhandledrejection", (event) => {
  send({ type: "runtime-error", diagnostic: toDiagnostic(event.reason, "runtime") });
});

send({ type: "sandbox-ready" });
