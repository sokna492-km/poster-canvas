/** Trigger a browser download from a data URL or raw string payload. */
export function downloadData(data: string, fileName: string, mimeType: string): void {
  const link = document.createElement("a");
  link.download = fileName;

  if (data.startsWith("data:")) {
    link.href = data;
  } else if (mimeType === "image/svg+xml") {
    // charset=utf-8: SVG markup often includes non-ASCII (e.g. Khmer).
    // Delay revoke: Chrome/Brave read blob: URLs asynchronously; revoking in the
    // click handler aborts the download and shows "Check internet connection".
    const blob = new Blob([data], { type: `${mimeType};charset=utf-8` });
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } else {
    link.href = `data:${mimeType};base64,${btoa(data)}`;
  }

  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportFileName(baseName: string, format: string): string {
  const safe = baseName.replace(/[^\w\- ]+/g, "").trim() || "poster";
  return `${safe}.${format}`;
}
