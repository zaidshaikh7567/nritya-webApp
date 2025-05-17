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

    default:
      break;
  }

  return error;
};
