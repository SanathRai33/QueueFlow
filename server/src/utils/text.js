const cleanText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

module.exports = { cleanText };
