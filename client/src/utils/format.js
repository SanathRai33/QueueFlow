export const formatTokenNumber = (number) => {
  return `#${String(number).padStart(3, "0")}`;
};
