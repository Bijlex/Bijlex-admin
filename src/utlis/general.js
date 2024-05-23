export const capitalizeWords = (str) => {
  return str
    .split("-") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the array back into a single string
};

export const customSort = (a, b) => {
  const parseOrder = (order) => {
    const regex = /(\d+)|([a-z]+)/g;
    return order
      .match(regex)
      .map((part) => (isNaN(part) ? part : parseInt(part, 10)));
  };

  const orderA = parseOrder(a.order);
  const orderB = parseOrder(b.order);

  for (let i = 0; i < Math.max(orderA.length, orderB.length); i++) {
    const partA = orderA[i];
    const partB = orderB[i];

    if (partA === undefined) return -1;
    if (partB === undefined) return 1;
    if (partA !== partB) {
      return partA > partB ? 1 : -1;
    }
  }

  return 0;
};
