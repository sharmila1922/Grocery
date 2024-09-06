export function formatCurrency(priceCents) {
  const conversionRate = 83; // Update this rate as needed
  const priceInRupees = (priceCents / 100) * conversionRate;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(priceInRupees);
}