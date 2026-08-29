import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SandboxBridge } from "./SandboxBridge";

describe("SandboxBridge", () => {
  let bridge: SandboxBridge;

  beforeEach(() => {
    bridge = new SandboxBridge();
  });

  afterEach(() => {
    bridge.destroy();
  });

  it("resolves export when export-done is received", async () => {
    const iframe = document.createElement("iframe");
    bridge.attach(iframe);

    const promise = bridge.export({ format: "png", requestId: "req-1" });

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "poster-sandbox",
          type: "export-done",
          requestId: "req-1",
          format: "png",
          data: "data:image/png;base64,abc",
          mimeType: "image/png",
        },
      }),
    );

    await expect(promise).resolves.toEqual({
      format: "png",
      data: "data:image/png;base64,abc",
      mimeType: "image/png",
    });
  });

  it("rejects export on export-failed", async () => {
    const promise = bridge.export({ format: "svg", requestId: "req-2" });

    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          source: "poster-sandbox",
          type: "export-failed",
          requestId: "req-2",
          message: "boom",
        },
      }),
    );

    await expect(promise).rejects.toThrow("boom");
  });

  it("calls onRendered callback", () => {
    const onRendered = vi.fn();
    const b = new SandboxBridge({ onRendered });
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { source: "poster-sandbox", type: "rendered" },
      }),
    );
    expect(onRendered).toHaveBeenCalledOnce();
    b.destroy();
  });
});
