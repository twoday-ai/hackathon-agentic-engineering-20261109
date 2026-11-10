import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => vi.unstubAllGlobals());

const starter = { subtotalCents: 10000, discountPercent: 10, discountCents: 1000, discountedSubtotalCents: 9000, shippingCents: 0, totalCents: 9000 };
const qualifies = { subtotalCents: 12000, discountPercent: 10, discountCents: 1200, discountedSubtotalCents: 10800, shippingCents: 0, totalCents: 10800 };

it("renders the real starter total and flags the shipping discrepancy", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(starter))));
  render(<App />);
  expect((await screen.findByTestId("checkout-total")).textContent).toBe("$90.00");
  expect(screen.getByText("The numbers don't match the rule.")).toBeTruthy();
  expect(screen.getByText(/contract requires \$5.00 shipping/)).toBeTruthy();
});

it("presets request a fresh calculation and render the returned breakdown", async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify(starter)))
    .mockResolvedValueOnce(new Response(JSON.stringify(qualifies)));
  vi.stubGlobal("fetch", fetchMock);
  render(<App />);
  await screen.findByTestId("checkout-total");
  fireEvent.click(screen.getByRole("button", { name: /Still qualifies/ }));
  await waitFor(() => expect(screen.getByTestId("checkout-total").textContent).toBe("$108.00"));
  expect(screen.getByText("This response matches the shipping rule.")).toBeTruthy();
  expect(fetchMock).toHaveBeenLastCalledWith("/api/checkout", expect.objectContaining({ body: '{"subtotalCents":12000,"discountPercent":10}' }));
});

it("clears stale results on edits and blocks fractional input", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(starter)));
  vi.stubGlobal("fetch", fetchMock);
  render(<App />);
  await screen.findByTestId("checkout-total");
  fireEvent.change(screen.getByLabelText(/Basket subtotal/), { target: { value: "10.5" } });
  expect(screen.queryByTestId("checkout-total")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Calculate checkout/ }));
  expect(screen.getByRole("alert").textContent).toContain("whole numbers");
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("shows loading and API errors instead of a fabricated receipt", async () => {
  let rejectFetch: (reason: Error) => void = () => { throw new Error("Fetch has not started."); };
  vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise((_resolve, reject) => { rejectFetch = reject; })));
  render(<App />);
  expect(screen.getByText("Waiting for the API response...")).toBeTruthy();
  expect(screen.getByRole("button", { name: /Calculating/ }).hasAttribute("disabled")).toBe(true);
  rejectFetch(new TypeError("network offline"));
  expect((await screen.findByRole("alert")).textContent).toContain("port 5080");
  expect(screen.queryByTestId("checkout-total")).toBeNull();
});
