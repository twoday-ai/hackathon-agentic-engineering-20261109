using Checkout.Api;

namespace Checkout.Tests;

public sealed class PricingTests
{
    private readonly PricingCalculator calculator = new();

    [Theory]
    [InlineData(10_000, 10, 1_000, 9_000, 500, 9_500)]
    [InlineData(12_000, 10, 1_200, 10_800, 0, 10_800)]
    public void ImmutableAcceptanceCases(
        int subtotal, int percent, int discount, int discountedSubtotal, int shipping, int total)
    {
        var actual = calculator.Calculate(new PricingRequest(subtotal, percent));

        Assert.Equal(new PricingResult(
            subtotal, percent, discount, discountedSubtotal, shipping, total), actual);
    }

    [Theory]
    [InlineData(9_999, 0, 9_999, 500)]
    [InlineData(10_000, 0, 10_000, 0)]
    [InlineData(10_001, 0, 10_001, 0)]
    [InlineData(11_110, 10, 9_999, 500)]
    [InlineData(11_111, 10, 10_000, 0)]
    [InlineData(11_112, 10, 10_001, 0)]
    public void ShippingBoundaryUsesDiscountedSubtotal(int subtotal, int percent, int discounted, int shipping)
    {
        var actual = calculator.Calculate(new PricingRequest(subtotal, percent));

        Assert.Equal(discounted, actual.DiscountedSubtotalCents);
        Assert.Equal(shipping, actual.ShippingCents);
        Assert.Equal(discounted + shipping, actual.TotalCents);
    }

    [Theory]
    [InlineData(0, 0, 0, 0, 500, 500)]
    [InlineData(8_000, 0, 0, 8_000, 500, 8_500)]
    [InlineData(20_000, 0, 0, 20_000, 0, 20_000)]
    [InlineData(8_000, 25, 2_000, 6_000, 500, 6_500)]
    [InlineData(999, 100, 999, 0, 500, 500)]
    [InlineData(100_000_000, 0, 0, 100_000_000, 0, 100_000_000)]
    public void NormalCases(int subtotal, int percent, int discount, int discounted, int shipping, int total)
    {
        Assert.Equal(
            new PricingResult(subtotal, percent, discount, discounted, shipping, total),
            calculator.Calculate(new PricingRequest(subtotal, percent)));
    }

    [Theory]
    [InlineData(4, 10, 0, 4)]
    [InlineData(5, 10, 1, 4)]
    [InlineData(6, 10, 1, 5)]
    [InlineData(15, 10, 2, 13)]
    [InlineData(999, 15, 150, 849)]
    public void RoundsDiscountToNearestCentWithMidpointsAwayFromZero(
        int subtotal, int percent, int discount, int discounted)
    {
        var actual = calculator.Calculate(new PricingRequest(subtotal, percent));

        Assert.Equal(discount, actual.DiscountCents);
        Assert.Equal(discounted, actual.DiscountedSubtotalCents);
        Assert.Equal(discounted + 500, actual.TotalCents);
    }

    [Theory]
    [InlineData(-1, 0)]
    [InlineData(100_000_001, 0)]
    [InlineData(int.MaxValue, 0)]
    [InlineData(0, -1)]
    [InlineData(0, 101)]
    public void RejectsInvalidInput(int subtotal, int percent)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() =>
            calculator.Calculate(new PricingRequest(subtotal, percent)));
    }

    [Fact]
    public void RejectsNullInput()
    {
        Assert.Throws<ArgumentNullException>(() => calculator.Calculate(null!));
    }
}
