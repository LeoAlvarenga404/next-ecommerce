export function calculateValueWithDiscount(price: number, discount: number) {
  return price - (price * discount) / 100;
}
