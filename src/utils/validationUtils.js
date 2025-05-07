export const validateField = (name, value) => {
  let error = "";
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  switch (name) {
    case "first_name":
      if (!trimmedValue) {
        error = "First name is required.";
      }
      break;

    case "middle_last_name":
      if (!trimmedValue) {
        error = "Last name is required.";
      }
      break;

    case "street_address":
      if (!trimmedValue) {
        error = "Street address is required.";
      }
      break;

    case "city":
      if (!trimmedValue) {
        error = "City is required.";
      }
      break;

    case "state_province":
      if (!trimmedValue) {
        error = "State is required.";
      }
      break;

    case "zip_pin_code":
      if (!trimmedValue || !/^\d{6}$/.test(trimmedValue)) {
        error = "ZIP/Pin code must be exactly 6 digits.";
      }
      break;

    case "phone_number":
      if (!trimmedValue || !/^\d{10}$/.test(trimmedValue)) {
        error = "Phone number must be a valid 10-digit number.";
      }
      break;

    case "aadhar":
      if (!trimmedValue || !/^\d{12}$/.test(trimmedValue)) {
        error = "Aadhar number must be exactly 12 digits.";
      }
      break;

    case "gstin":
      if (
        !trimmedValue ||
        !/^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz]{1}[0-9A-Za-z]{1}$/.test(
          trimmedValue
        )
      ) {
        error = "GSTIN must be a valid format (e.g., 22ABCDE0000A1Z5).";
      }
      break;

    default:
      break;
  }

  return error;
};
