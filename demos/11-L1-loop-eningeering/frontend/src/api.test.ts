import { afterEach, describe, expect, it, vi } from "vitest";
import { calculate, parseInputs } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("integer pricing inputs", () => {
  it("accepts inclusive limits and preserves integer cents", () => {
    expect(parseInputs("0", "0")).toEqual({ subtotalCents: 0, discountPercent: 0 });
    expect(parseInputs("100000000", "100")).toEqual({ subtotalCents: 100_000_000, discountPercent: 100 });
  });

  it.each([["", "10"], ["-1", "10"], ["10.5", "10"], ["10000", "1.5"], ["1e4", "10"], ["100000001", "0"], ["0", "101"]])(
    "rejects invalid input %s / %s", (subtotal, discount) => {
      expect(() => parseInputs(subtotal, discount)).toThrow();
    },
  );
});

describe("API client", () => {
  it("uses the actual API response without repairing the starter's result", async () => {
    const starter = { subtotalCents: 10000, discountPercent: 10, discountCents: 1000, discountedSubtotalCents: 9000, shippingCents: 0, totalCents: 9000 };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(starter)));
    vi.stubGlobal("fetch", fetchMock);
    expect(await calculate({ subtotalCents: 10000, discountPercent: 10 })).toEqual(starter);
    expect(fetchMock).toHaveBeenCalledWith("/api/checkout", expect.objectContaining({ method: "POST", body: '{"subtotalCents":10000,"discountPercent":10}' }));
  });

  it("reports HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 400 })));
    await expect(calculate({ subtotalCents: 0, discountPercent: 0 })).rejects.toThrow("HTTP 400");
  });

  it("reports unreachable backend", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    await expect(calculate({ subtotalCents: 0, discountPercent: 0 })).rejects.toThrow("port 5080");
  });

  it("rejects malformed or mismatched response shapes", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response('{"totalCents":9000}')));
    await expect(calculate({ subtotalCents: 10000, discountPercent: 10 })).rejects.toThrow("unexpected pricing response");
  });
});
