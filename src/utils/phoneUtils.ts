// Format South African phone number with spaces (e.g., 082 123 4567)
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits
  const limited = digits.slice(0, 10);

  // Format with spaces: XXX XXX XXXX
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)} ${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
  }
};

// Remove spaces from phone number for storage/submission
export const unformatPhoneNumber = (value: string): string => {
  return value.replace(/\s/g, '');
};

// Validate South African phone number (10 digits)
export const isValidPhoneNumber = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10;
};
