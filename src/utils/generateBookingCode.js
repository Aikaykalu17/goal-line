export default function generateBookingCode() {
  const part1 = Math.floor(1000 + Math.random() * 9000); // 4 digits
  const part2 = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `GLT-${part1}-${part2}`;
}
