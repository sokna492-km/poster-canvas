import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SandboxBridge } from "./SandboxBridge";

function createAttachedIframe(bridge: SandboxBridge): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);
  bridge.attach(iframe);
  return iframe;
}

function dispatchFromIframe(iframe: HTMLIFrameElement, data: unknown): void {
  window.dispatchEvent(
    new MessageEvent("message", {
      data,
      source: iframe.contentWindow,
    }),
  );
}

describe("SandboxBridge", () => {
  let bridge: SandboxBridge;

  beforeEach(() => {
    bridge = new SandboxBridge();
  });

  afterEach(() => {
    bridge.destroy();
    document.body.replaceChildren();
  });

  it("resolves export when export-done is received", async () => {
    const iframe = createAttachedIframe(bridge);

    const promise = bridge.export({ format: "png", requestId: "req-1" });

    dispatchFromIframe(iframe, {
      source: "poster-sandbox",
      type: "export-done",
      requestId: "req-1",
      format: "png",
      data: "data:image/png;base64,abc",
      mimeType: "image/png",
    });

    await expect(promise).resolves.toEqual({
      format: "png",
      data: "data:image/png;base64,abc",
      mimeType: "image/png",
    });
  });

  it("rejects export on export-failed", async () => {
    const iframe = createAttachedIframe(bridge);
    const promise = bridge.export({ format: "svg", requestId: "req-2" });

    dispatchFromIframe(iframe, {
      source: "poster-sandbox",
      type: "export-failed",
      requestId: "req-2",
      message: "boom",
    });

    await expect(promise).rejects.toThrow("boom");
  });

  it("calls onRendered callback when attached", () => {
    const onRendered = vi.fn();
    const b = new SandboxBridge({ onRendered });
    const iframe = createAttachedIframe(b);

    dispatchFromIframe(iframe, { source: "poster-sandbox", type: "rendered" });
    expect(onRendered).toHaveBeenCalledOnce();
    b.destroy();
  });

  it("ignores messages before attach", () => {
    const onReady = vi.fn();
    const onRendered = vi.fn();
    const b = new SandboxBridge({ onReady, onRendered });

    window.dispatchEvent(
      new MessageEvent("message", {
        data: { source: "poster-sandbox", type: "sandbox-ready" },
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { source: "poster-sandbox", type: "rendered" },
      }),
    );

    expect(onReady).not.toHaveBeenCalled();
    expect(onRendered).not.toHaveBeenCalled();
    expect(b.isAttached).toBe(false);
    expect(b.isReady).toBe(false);
    b.destroy();
  });

  it("detach clears attachment and ignores further messages", () => {
    const onRendered = vi.fn();
    const b = new SandboxBridge({ onRendered });
    const iframe = createAttachedIframe(b);
    expect(b.isAttached).toBe(true);

    b.detach();
    expect(b.isAttached).toBe(false);
    expect(b.isReady).toBe(false);

    dispatchFromIframe(iframe, { source: "poster-sandbox", type: "rendered" });
    expect(onRendered).not.toHaveBeenCalled();
    b.destroy();
  });
});
