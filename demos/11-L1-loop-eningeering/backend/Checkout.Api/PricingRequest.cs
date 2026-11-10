using System.Text.Json.Serialization;

namespace Checkout.Api;

public sealed record PricingRequest(
    [property: JsonRequired] int SubtotalCents,
    [property: JsonRequired] int DiscountPercent)
{
    public const int MaximumSubtotalCents = 100_000_000;

    public Dictionary<string, string[]> Validate()
    {
        var errors = new Dictionary<string, string[]>();

        if (SubtotalCents is < 0 or > MaximumSubtotalCents)
        {
            errors[nameof(SubtotalCents)] = ["Subtotal must be an integer from 0 to 100000000 cents."];
        }

        if (DiscountPercent is < 0 or > 100)
        {
            errors[nameof(DiscountPercent)] = ["Discount must be a whole percentage from 0 to 100."];
        }

        return errors;
    }
}
