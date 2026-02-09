export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

export const isDateBefore = (date: Date, compareDate: string): boolean => {
  const compare = new Date(compareDate);
  compare.setHours(0, 0, 0, 0);
  return date < compare;
};

export const isDateAfter = (date: Date, compareDate: string): boolean => {
  const compare = new Date(compareDate);
  compare.setHours(23, 59, 59, 999);
  return date > compare;
};
