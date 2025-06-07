export const toBRL = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const toBrazilianNumber = (value: number): string => {
  const isInteger = Number.isInteger(value);

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });
};
