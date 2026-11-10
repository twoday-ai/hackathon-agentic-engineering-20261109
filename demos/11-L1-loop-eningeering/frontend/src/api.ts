export interface PricingRequest {
  subtotalCents: number;
  discountPercent: number;
}

export interface PricingResult extends PricingRequest {
  discountCents: number;
  discountedSubtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function parseInputs(subtotal: string, discount: string): PricingRequest {
  if (!/^\d+$/.test(subtotal) || !/^\d+$/.test(discount)) {
    throw new Error("Enter whole numbers for subtotal cents and discount percent.");
  }
  const subtotalCents = Number(subtotal);
  const discountPercent = Number(discount);
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents > 100_000_000) {
    throw new Error("Subtotal must be from 0 to 100,000,000 cents.");
  }
  if (discountPercent > 100) {
    throw new Error("Discount must be from 0 to 100 percent.");
  }
  return { subtotalCents, discountPercent };
}

function isPricingResult(value: unknown): value is PricingResult {
  if (typeof value !== "object" || value === null) return false;
  const fields: (keyof PricingResult)[] = [
    "subtotalCents", "discountPercent", "discountCents",
    "discountedSubtotalCents", "shippingCents", "totalCents",
  ];
  return fields.every((key) => key in value
    && typeof Reflect.get(value, key) === "number"
    && Number.isSafeInteger(Reflect.get(value, key))
    && Reflect.get(value, key) >= 0);
}

export async function calculate(request: PricingRequest, signal?: AbortSignal): Promise<PricingResult> {
  let response: Response;
  try {
    response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subtotalCents: request.subtotalCents,
        discountPercent: request.discountPercent,
      }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("Cannot reach the API. Start the backend on port 5080, then try again.");
  }
  if (!response.ok) {
    throw new Error(`The API rejected this calculation (HTTP ${response.status}). Check the inputs and backend terminal.`);
  }
  const result: unknown = await response.json();
  if (!isPricingResult(result)
    || result.subtotalCents !== request.subtotalCents
    || result.discountPercent !== request.discountPercent) {
    throw new Error("The API returned an unexpected pricing response.");
  }
  return result;
}
