export const refreshLocation = (city) => {
  console.log("Location changed refresh");
  return{
    type: 'REFRESH_LOCATION',
    city: city,
  }
};