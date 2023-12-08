export const refreshLocation = () => {
  console.log("Location changed refresh");
  return{
    type: 'REFRESH_LOCATION_COUNTER',
  }
};