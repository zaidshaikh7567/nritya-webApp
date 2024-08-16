export const validateField = (name, value) => {
  let error = '';
  console.log(name, value)
  switch (name) {
      case 'phone_number':
          if (!/^\d{10}$/.test(value)) {
              error = 'Phone number must be exactly 10 digits.';
          }
          break;
      case 'zip_pin_code':
          if (!/^\d{6}$/.test(value)) {
              error = 'ZIP/Pin code must be exactly 6 digits.';
          }
          break;
      case 'aadhar':
          if (!/^\d{12}$/.test(value)) {
              error = 'Aadhar number must be exactly 12 digits.';
          }
          break;
      case 'gstin':
          if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value)) {
              error = 'GSTIN must be a valid format (e.g., 22AAAAA0000A1Z5).';
          }
          break;
      default:
          break;
  }
  console.log(error)

  return error;
};
