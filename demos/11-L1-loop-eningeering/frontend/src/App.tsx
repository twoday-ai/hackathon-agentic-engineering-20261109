import { useEffect, useRef, useState, type FormEvent } from "react";
import { calculate, parseInputs, type PricingRequest, type PricingResult } from "./api";

const presets = [
  { name: "Threshold trap", detail: "10,000 cents / 10%", subtotalCents: 10_000, discountPercent: 10 },
  { name: "Still qualifies", detail: "12,000 cents / 10%", subtotalCents: 12_000, discountPercent: 10 },
  { name: "Exact boundary", detail: "10,000 cents / 0%", subtotalCents: 10_000, discountPercent: 0 },
];
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const money = (cents: number) => currency.format(cents / 100);

export default function App() {
  const [subtotal, setSubtotal] = useState("10000");
  const [discount, setDiscount] = useState("10");
  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);

  async function run(request: PricingRequest) {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const next = await calculate(request, active.signal);
      if (id === requestId.current) setResult(next);
    } catch (cause) {
      if (!active.signal.aborted && id === requestId.current) {
        setError(cause instanceof Error ? cause.message : "The calculation failed. Check the API terminal.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    void run({ subtotalCents: 10_000, discountPercent: 10 });
    return () => { controller.current?.abort(); };
  }, []);

  function invalidate() {
    controller.current?.abort();
    requestId.current += 1;
    setLoading(false);
    setResult(null);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const request = parseInputs(subtotal, discount);
      void run(request);
    } catch (cause) {
      invalidate();
      setError(cause instanceof Error ? cause.message : "Check the pricing inputs.");
    }
  }

  const expectedShipping = result && (result.discountedSubtotalCents >= 10_000 ? 0 : 500);
  const shippingMismatch = result !== null && result.shippingCents !== expectedShipping;
  const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const [currentTheme, setCurrentTheme] = useState(theme);

  function toggleTheme() {
    const next = currentTheme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    setCurrentTheme(next);
  }

  return (
    <main className="app-shell">
        <div className="workspace-grid">
          <section className="card calculator" aria-labelledby="basket-title">
            <div className="section-heading">
              <span className="tiny-label">YOUR BASKET</span>
              <button className="theme-button" onClick={toggleTheme} aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} theme`}>
                {currentTheme === "light" ? "Dark" : "Light"} mode
              </button>
            </div>
            <h1 id="basket-title">Checkout calculator</h1>
            <p className="section-copy">Choose a preset or enter your subtotal and discount.</p>
            <div className="presets" aria-label="Checkout presets">
              {presets.map((preset) => (
                <button key={preset.name} className={subtotal === String(preset.subtotalCents) && discount === String(preset.discountPercent) ? "preset selected" : "preset"}
                  onClick={() => {
                    setSubtotal(String(preset.subtotalCents));
                    setDiscount(String(preset.discountPercent));
                    void run(preset);
                  }}>
                  <strong>{preset.name}</strong><span>{preset.detail}</span>
                </button>
              ))}
            </div>
            <form onSubmit={submit} noValidate>
              <div className="input-row">
                <div className="field">
                  <label htmlFor="subtotal">Basket subtotal <span>cents</span></label>
                  <input id="subtotal" name="subtotal" type="number" inputMode="numeric" min="0" max="100000000" step="1" value={subtotal}
                    onChange={(event) => { setSubtotal(event.target.value); invalidate(); }} aria-describedby="subtotal-help" />
                  <small id="subtotal-help">10,000 cents = $100.00</small>
                </div>
                <div className="field discount-field">
                  <label htmlFor="discount">Discount <span>%</span></label>
                  <input id="discount" name="discount" type="number" inputMode="numeric" min="0" max="100" step="1" value={discount}
                    onChange={(event) => { setDiscount(event.target.value); invalidate(); }} aria-describedby="discount-help" />
                  <small id="discount-help">Whole percent, 0-100</small>
                </div>
              </div>
              <button type="submit" className="primary-button" disabled={loading}>{loading ? "Calculating..." : "Calculate checkout"}<span aria-hidden="true">&rarr;</span></button>
            </form>
            {error && <div role="alert" className="error-message">{error}</div>}
            <div className="rules">
              <h3>Pricing rules</h3>
              <p><span>01</span> Round the percentage discount to the nearest cent; half cents round up.</p>
              <p><span>02</span> Subtract that discount from the basket subtotal.</p>
              <p><span>03</span> Shipping is $5.00, or free at a <strong>discounted subtotal &ge; $100.00</strong>.</p>
            </div>
          </section>

          <section className="card receipt" aria-labelledby="receipt-title" aria-busy={loading}>
            <div className="section-heading"><span className="tiny-label">PRICE BREAKDOWN</span></div>
            <h2 id="receipt-title">Order summary</h2>
            <p className="section-copy">Your discount, shipping, and total in USD.</p>
            <div role="status" aria-live="polite" className="receipt-content">
              {result ? (
                <>
                  <dl className="breakdown">
                    <div><dt>Basket subtotal</dt><dd>{money(result.subtotalCents)}</dd></div>
                    <div><dt>Discount <span>({result.discountPercent}%)</span></dt><dd>-{money(result.discountCents)}</dd></div>
                    <div className="discounted-line"><dt>Discounted subtotal</dt><dd>{money(result.discountedSubtotalCents)}</dd></div>
                    <div><dt>Shipping</dt><dd>{money(result.shippingCents)}</dd></div>
                    <div className="total-line"><dt>Total</dt><dd data-testid="checkout-total">{money(result.totalCents)}</dd></div>
                  </dl>
                  <div className={shippingMismatch ? "rule-check mismatch" : "rule-check matched"}>
                    <span className="tiny-label">SHIPPING RULE</span>
                    <strong>{shippingMismatch ? "The numbers don't match the rule." : "This response matches the shipping rule."}</strong>
                    <p>{shippingMismatch
                      ? `At a discounted subtotal of ${money(result.discountedSubtotalCents)}, the contract requires ${money(expectedShipping ?? 0)} shipping. The API returned ${money(result.shippingCents)}.`
                      : "Shipping is free when the discounted subtotal reaches $100.00."}</p>
                  </div>
                </>
              ) : (
                <div className="empty-receipt">{loading ? "Waiting for the API response..." : "Calculate a basket to see a fresh API response."}</div>
              )}
            </div>
          </section>
        </div>
    </main>
  );
}
