export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export const formatDate = (
  date: string | Date,
  format: string = "PPP",
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "MMMM yyyy") {
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
