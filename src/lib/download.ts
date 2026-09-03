/** Trigger a browser download from a data URL or raw string payload. */
export function downloadData(data: string, fileName: string, mimeType: string): void {
  const link = document.createElement("a");
  link.download = fileName;

  const blobMimes = [
    "image/svg+xml",
    "text/csv",
    "application/postscript",
    "application/eps",
    "image/vnd.adobe.photoshop",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/octet-stream",
  ];

  const isBlobMime = blobMimes.some((m) => mimeType.startsWith(m));

  if (data.startsWith("data:")) {
    // Prefer object URL for large binary data-URLs (PSD/PPTX/XLSX).
    if (
      mimeType.includes("photoshop") ||
      mimeType.includes("presentationml") ||
      mimeType.includes("spreadsheetml") ||
      data.length > 1_500_000
    ) {
      const blob = dataUrlToBlob(data);
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } else {
      link.href = data;
    }
  } else if (isBlobMime) {
    const blob = new Blob([data], {
      type: mimeType.includes("charset") ? mimeType : `${mimeType};charset=utf-8`,
    });
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } else {
    link.href = `data:${mimeType};base64,${btoa(unescape(encodeURIComponent(data)))}`;
  }

  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const i = dataUrl.indexOf(",");
  const header = dataUrl.slice(0, i);
  const payload = dataUrl.slice(i + 1);
  const mime = /data:([^;]+)/i.exec(header)?.[1] ?? "application/octet-stream";
  if (/;base64/i.test(header)) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let n = 0; n < binary.length; n += 1) bytes[n] = binary.charCodeAt(n);
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(payload)], { type: mime });
}

export function exportFileName(baseName: string, format: string): string {
  const safe = baseName.replace(/[^\w\- ]+/g, "").trim() || "poster";
  return `${safe}.${format}`;
}
