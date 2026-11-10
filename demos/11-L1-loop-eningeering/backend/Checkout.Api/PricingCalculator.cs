namespace Checkout.Api;

public sealed class PricingCalculator
{
    public PricingResult Calculate(PricingRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        if (request.Validate().Count != 0)
        {
            throw new ArgumentOutOfRangeException(nameof(request), "Invalid checkout pricing input.");
        }

        var discountCents = (int)decimal.Round(
            request.SubtotalCents * (decimal)request.DiscountPercent / 100m,
            0,
            MidpointRounding.AwayFromZero);
        var discountedSubtotalCents = request.SubtotalCents - discountCents;
        var shippingCents = discountedSubtotalCents >= 10_000 ? 0 : 500;

        return new PricingResult(
            request.SubtotalCents,
            request.DiscountPercent,
            discountCents,
            discountedSubtotalCents,
            shippingCents,
            discountedSubtotalCents + shippingCents);
    }
}

public sealed record PricingResult(
    int SubtotalCents,
    int DiscountPercent,
    int DiscountCents,
    int DiscountedSubtotalCents,
    int ShippingCents,
    int TotalCents);
