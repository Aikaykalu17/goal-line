const formatWithCommas = (amount) => {
  const num = Number(amount) || 0;
  return num.toLocaleString("en-NG");
};
export default formatWithCommas;
