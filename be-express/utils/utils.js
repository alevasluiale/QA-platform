const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const parseProperties = (properties) => {
  return Object.entries(properties)
    .map(([key, value]) => `${key}:${value}`)
    .join(",");
};

module.exports = { isValidEmail, parseProperties };
