function formatNumber(value) {
  if (value === "" || value === null) return "";
  // remove non-digits first
  const numbers = value.toString().replace(/,/g, "").replace(/\D/g, "");
  // add commas
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default formatNumber;
